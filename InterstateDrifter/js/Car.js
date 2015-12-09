const STRAFE_MAX_SPEED = 6;
const STRAFE_MIN_SPEED = 0;
const STRAFE_SPEED = 6;
const STRAFE_PIVOT_AMT = 0.20;

const CAR_MAX_SPEED = 13;
const CAR_MIN_SPEED = 0;
const CAR_GAS_SPEED = 0.21;
const CAR_BRAKE_SPEED = 0.3;
const CAR_HIT_WALL_SPEED = 0.95;
const CAR_ROLL_TO_STOP = 0.981;
const CAR_ROLL_TO_STOP_WHILE_TURN = 0.975;

const CAR_MIN_Y = 1000;
const CAR_EDGE_MARGIN = 50;

const MILES_PER_PIXEL = (1.0/528.0) / 12;

var vectorWid = 0;
var vectorHei = 0;

var carPoints = [{x: 0, y:7},
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

function carClass() {
    this.carX = 75;
    this.carY = 75;
    this.carSpeed = 0;
    this.needleSpeed = 0;
    this.needleWobbleOsc = 0;
    this.needleWobbleOsc2 = 0;
    this.carTurnSpeed = 0;
    // Gets reset each row added.
    this.carOdom = 0;
    this.totalDistance = 0;
    this.currentCarMoveDelta = 0;
    this.carAng =  -.5 * Math.PI;
    this.carSteering = 0.0;
    this.sensorLeft = 0;
    this.sensorRight = 0;

    this.spinoutTimer = 0;

    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;
    this.keyHeld_Gas = false;
    this.keyHeld_Brake = false;

    this.setupControls = function(leftKey, rightKey, forwardKey, downKey) {
        this.controlKeyForTurnLeft = leftKey;
        this.controlKeyForTurnRight = rightKey;
        this.controlKeyForGas = forwardKey;
        this.controlKeyForBrake = downKey;
    }

    this.initCar = function(whichName) {
        this.myName = whichName;
        this.carReset();
        this.mirrorVector();
        this.setupVectorDim();
        trackCenterCar();
    }

    this.mirrorVector = function() {
        var mirrorY = -1000;

        for (var i = 0; i < carPoints.length; i++) {
            if (carPoints[i].y > mirrorY) {
                mirrorY = carPoints[i].y;
            }
        }

        var mirrorCar = JSON.parse(JSON.stringify(carPoints));//carPoints.slice(0);
        mirrorCar.reverse();

        for (var i = 0; i < mirrorCar.length; i++) {
            var distFromMirror = mirrorY - mirrorCar[i].y;
            mirrorCar[i].y = mirrorY + distFromMirror;
        }

        carPoints = carPoints.concat(mirrorCar);
    }

    this.setupVectorDim = function() {
        var leftMost = 1000.0;
        var rightMost = -1000.0;
        var topMost = 1000.0;
        var bottomMost = -1000.0;

        for(var i=0;i<carPoints.length;i++) {
            if(carPoints[i].x < leftMost) {
                leftMost = carPoints[i].x;
            }

            if(carPoints[i].x > rightMost) {
                rightMost = carPoints[i].x;
            }

            if(carPoints[i].y < topMost) {
                topMost = carPoints[i].y;
            }
            
            if(carPoints[i].y > bottomMost) {
                bottomMost = carPoints[i].y;
            }
        // same for y with top and bottom
        }

        vectorWid = rightMost - leftMost;
        vectorHei = bottomMost - topMost;
    }

    this.drawCar = function() {
        canvasContext.save();
        canvasContext.translate(this.carX, this.carY);
        if (this.spinoutTimer > 0) {
            canvasContext.rotate(randomInRange(0, 2 * Math.PI));
        }
        else {
            canvasContext.rotate(this.carAng);
        }
        canvasContext.translate(-vectorWid / 2, -vectorHei / 2);
        canvasContext.beginPath();
        canvasContext.moveTo(carPoints[0].x, carPoints[0].y);
        
        for (var i = 1; i < carPoints.length; i++) {
            canvasContext.lineTo(carPoints[i].x, carPoints[i].y);
        }

        canvasContext.strokeStyle = "white";
        canvasContext.stroke();
        canvasContext.restore();
    }

    this.drawAngSeg = function(fromX, fromY, ang, dist1, dist2, color, width) {
        var startX = Math.cos(ang) * dist1 + fromX;
        var startY = Math.sin(ang) * dist1 + fromY;
        var endX = Math.cos(ang) * dist2 + fromX;
        var endY = Math.sin(ang) * dist2 + fromY;

        colorLine(startX, startY, endX, endY, color, width);
    }

    this.carReset = function() {
        this.carAng = -0.5 * Math.PI;
        if (this.homeX == undefined) {
            this.homeX = canvas.width / 2;
            this.homeY = canvas.height * 2 - CAR_EDGE_MARGIN;
        }

        this.carX = this.homeX;
        this.carY = this.homeY;
    }

    this.carMove = function() {
        var nextX = this.carX;
        var nextY = this.carY;

        // Position of the car vertically based on speed
        var carYRange = this.homeY - CAR_MIN_Y;
        var carSpeedRange = CAR_MAX_SPEED - CAR_MIN_SPEED;
        var carSpeedPerc = this.carSpeed / carSpeedRange;
        nextY = this.homeY - carYRange * carSpeedPerc;

        // Translate car movement to odometer and actual car distance
        this.currentCarMoveDelta = this.carSpeed * TRACK_H / 30;
        this.carOdom += this.currentCarMoveDelta; //  * 0.2
        this.totalDistance += this.currentCarMoveDelta;

        //Steer car and spin out that prevents from steering
        var steerToward = 0.0;

        if (this.spinoutTimer > 0) {
            this.spinoutTimer --;
        } else {
            if (this.keyHeld_TurnLeft) {
                steerToward = -1.0;
            } else if (this.keyHeld_TurnRight) {
                steerToward = 1.0;
            }

        }

        // Make steering rate proportional to speed.
        var minTurnAbility = 0.05;

        if (carSpeedPerc < minTurnAbility) {
            steerToward *= minTurnAbility * 3.0;
        } else {
            steerToward *= carSpeedPerc * 3.0;
        }
        
        // Preventing steering from exceeding maximum.
        if (steerToward > 1.0) {
            steerToward = 1.0;
        } else if (steerToward < -1.0) {
            steerToward = -1.0;
        }

        // Smooth out steering.
        var kValue = 0.80; 
        this.carSteering = kValue * this.carSteering + (1.0-kValue) * steerToward;

        // Setting visual angle
        this.carAng = (-0.5 + STRAFE_PIVOT_AMT * this.carSteering) * Math.PI;
        // Steering the car
        nextX +=  STRAFE_SPEED * this.carSteering;
        this.carY = nextY;


        var wallBounds = getTrackBoundriesAt(this.carY);
        var wallXLeft = wallBounds.leftSidePixels;
        var wallXRight = wallBounds.rightSidePixels;
        this.sensorLeft = wallXLeft;
        this.sensorRight = wallXRight;
        var carXRange = TRACK_COLS - (wallXLeft + wallXRight);

        // Check if you are within the walls
        if (nextX > wallXLeft && nextX< wallXRight)
        {
            // Increase or decrease car's speed when up or down arrow is pushed.
            if (this.keyHeld_Gas && this.spinoutTimer <= 0) {
                this.carSpeed += CAR_GAS_SPEED;
            } else if (this.keyHeld_Brake) {
                this.carSpeed -= CAR_BRAKE_SPEED;
            }

            // Decreasing speed when you are turning.
            if (this.keyHeld_TurnLeft || this.keyHeld_TurnRight) {
                this.carSpeed *= CAR_ROLL_TO_STOP_WHILE_TURN;
            } else {
                this.carSpeed *= CAR_ROLL_TO_STOP;
            }

            // Limiting the car's speed.
            if (this.carSpeed > CAR_MAX_SPEED) {
                this.carSpeed = CAR_MAX_SPEED;
            } else if (this.carSpeed < CAR_MIN_SPEED) {
                this.carSpeed = CAR_MIN_SPEED;
            }

            this.carX = nextX;
        } else { // Gone out of bounds. Decrease speed, dragging.
            this.carSpeed *= CAR_HIT_WALL_SPEED;
            if (this.carX < wallXLeft) {
                this.carX = wallXLeft;
            } else if (this.carX > wallXRight) {
                this.carX = wallXRight;
            }// Car off right side
        }// Car hit wall
    }// End of car move

} // End of car class