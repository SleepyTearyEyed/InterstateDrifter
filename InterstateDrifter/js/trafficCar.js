const LANE_MARGIN_PERC = 0.15;
const LANE_CHANGE_SPEED = 3.0;
const LANE_CHANGE_ANG = 0.05 * Math.PI;
const TRAFFIC_CAR_MIN_SPEED = 8;
const TRAFFIC_CAR_MAX_SPEED = 12;
const TRAFFIC_CAR_SPEED_MAX_DELTA = 3;
const CLOSE_ENOUGH_TO_COLLIDE = 20;
const COLLISION_EFFECT_TIME = 15;
const COLLISION_EFFECT_MULT = 3;

var trafficCarPoints = [{x: 0, y:7},
                        {x:0,y:2},
                        {x:1,y:1},
                        {x:3,y:0},
                        {x:7,y:0},
                        {x:9,y:2},
                        {x:12,y:2},
                        {x:14,y:0},
                        {x:18,y:0},
                        {x:19,y:2},
                        {x:22,y:2},
                        {x:23,y:4},
                        {x:23,y:7},
                        {x:20,y:7}];

function mirrorVector() {
    var mirrorY = -1000;

    for (var i = 0; i < trafficCarPoints.length; i++) {
        if (trafficCarPoints[i].y > mirrorY) {
            mirrorY = trafficCarPoints[i].y;
        }
    }

    var mirrorCar = JSON.parse(JSON.stringify(trafficCarPoints));
    mirrorCar.reverse();

    for (var i = 0; i < mirrorCar.length; i++) {
        var distFromMirror = mirrorY - mirrorCar[i].y;
        mirrorCar[i].y = mirrorY + distFromMirror;
    }

    trafficCarPoints = trafficCarPoints.concat(mirrorCar);
}

function setupVectorDim() {
    var leftMost = 1000.0;
    var rightMost = -1000.0;
    var topMost = 1000.0;
    var bottomMost = -1000.0;

    for(var i=0;i<trafficCarPoints.length;i++) {
        if(trafficCarPoints[i].x < leftMost) {
            leftMost = trafficCarPoints[i].x;
        }

        if(trafficCarPoints[i].x > rightMost) {
            rightMost = trafficCarPoints[i].x;
        }

        if(trafficCarPoints[i].y < topMost) {
            topMost = trafficCarPoints[i].y;
        }
        
        if(trafficCarPoints[i].y > bottomMost) {
            bottomMost = trafficCarPoints[i].y;
        }
    // same for y with top and bottom
    }

    vectorWid = rightMost - leftMost;
    vectorHei = bottomMost - topMost;
}

function setupTrafficCarImage()                        {
    mirrorVector();
    setupVectorDim();
}

function trafficCarClass() {

    this.x = 5;
    this.y = 5;
    this.targetX = 5;
    this.lanePerc = 0.4;
    this.framesTillLaneSwitch = 0;
    this.angle = -0.5 * Math.PI;
    this.speed = 6;
    this.steeringOverrideDir = 0;
    this.steeringOverrideTimer = 0;
    this.readyToRemove = false;

    this.init = function() {
        if (Math.random() < .5) {
            this.resetBottom();
        } else {
            this.resetTop();
        }
    }

    this.resetTop = function() {
        this.y = 0;
        this.startOnTrack();
    }

    this.resetBottom = function() {
        this.y = canvas.height;
        this.startOnTrack();
    }

    this.startOnTrack = function() {
        var boundaries = getTrackBoundriesAt(this.y);
        this.lanePerc = randomInRange(0.1, 0.9);
        this.x = this.lanePerc * boundaries.leftSidePixels + (1.0 - this.lanePerc) * boundaries.rightSidePixels; 
    }

    this.move = function() {
        this.y += p1.currentCarMoveDelta;
        this.y -= this.speed;

        if (this.y < 0) {
            //this.resetBottom();
            this.readyToRemove = true;
        }

        if (this.y > canvas.height) {
            //this.resetTop();
            this.readyToRemove = true;
        }

        var xDistFromP1 = Math.abs(p1.carX - this.x);
        var yDistFromP1 = Math.abs(p1.carY - this.y);
        var approxDist = xDistFromP1 + yDistFromP1;

        if (approxDist < CLOSE_ENOUGH_TO_COLLIDE) {
            if (this.x < p1.carX) {
                this.steeringOverrideDir = -1;
            }
            else
            {
                this.steeringOverrideDir = 1;
            }
            this.steeringOverrideTimer = COLLISION_EFFECT_TIME;
            this.speed *= 0.5;
            p1.spinoutTimer = 15;
            console.log("Car is hit!");
        }

        var boundaries = getTrackBoundriesAt(this.y);
        this.targetX = this.lanePerc * boundaries.leftSidePixels + (1.0 - this.lanePerc) * boundaries.rightSidePixels;

        this.angle = -0.5 * Math.PI;

        if (this.steeringOverrideDir == 0) {
            if (this.x < this.targetX) {
                this.x += LANE_CHANGE_SPEED;
                this.angle += LANE_CHANGE_ANG;
            }

            if (this.x > this.targetX) {
                this.x -= LANE_CHANGE_SPEED;
                this.angle -= LANE_CHANGE_ANG;
            }
        } else if (this.steeringOverrideDir < 0) {
                this.x -= LANE_CHANGE_SPEED * COLLISION_EFFECT_MULT;
                this.angle -= LANE_CHANGE_ANG * COLLISION_EFFECT_MULT;
        } else {
                this.x += LANE_CHANGE_SPEED * COLLISION_EFFECT_MULT;
                this.angle += LANE_CHANGE_ANG * COLLISION_EFFECT_MULT;
        }

        this.steeringOverrideTimer--;

        if (this.steeringOverrideTimer < 0) {
            this.steeringOverrideDir = 0;
        }

        if (this.x < boundaries.leftSidePixels) {
            this.x = boundaries.leftSidePixels;
        }

        if (this.x > boundaries.rightSidePixels) {
            this.x = boundaries.rightSidePixels;
        }

        this.framesTillLaneSwitch--;

        if (this.framesTillLaneSwitch < 0 && this.steeringOverrideDir == 0) {
            this.lanePerc = randomInRange(LANE_MARGIN_PERC, 1.0 - LANE_MARGIN_PERC);
            this.framesTillLaneSwitch = Math.random() * 30 + 30;
            this.speed += randomInRange(-TRAFFIC_CAR_SPEED_MAX_DELTA, TRAFFIC_CAR_SPEED_MAX_DELTA);

            if (this.speed < TRAFFIC_CAR_MIN_SPEED) {
                this.speed = TRAFFIC_CAR_MIN_SPEED;
            }

            if (this.speed > TRAFFIC_CAR_MAX_SPEED) {
                this.speed = TRAFFIC_CAR_MAX_SPEED; 
            }
        }
    }

    this.draw = function() {
        //colorRect(this.x - 5, this.y - 5, 10, 10, "yellow");
        //colorCircle(this.targetX, this.y, 5, "#ff7f00");
        canvasContext.save();
        canvasContext.translate(this.x, this.y);
        canvasContext.rotate(this.angle);
        //canvasContext.translate(-vectorWid / 2, -vectorHei / 2);
        canvasContext.beginPath();
        canvasContext.moveTo(trafficCarPoints[0].x, trafficCarPoints[0].y);
        
        for (var i = 1; i < trafficCarPoints.length; i++) {
            canvasContext.lineTo(trafficCarPoints[i].x, trafficCarPoints[i].y);
        }

        canvasContext.strokeStyle = "white";
        canvasContext.stroke();
        canvasContext.restore();
    }
}