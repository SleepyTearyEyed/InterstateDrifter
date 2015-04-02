const STRAFE_MAX_SPEED = 6;
const STRAFE_MIN_SPEED = 0;
const STRAFE_SPEED = 6;
const STRAFE_PIVOT_AMT = 0.20;

const CAR_MAX_SPEED = 13;
const CAR_MIN_SPEED = 0;
const CAR_GAS_SPEED = 0.18;
const CAR_BRAKE_SPEED = 0.22;
const CAR_HIT_WALL_SPEED = 0.85;

const CAR_MIN_Y = 400;
const CAR_EDGE_MARGIN = 50;

function carClass() {
    this.carX = 75;
    this.carY = 75;
    this.carSpeed = 0;
    this.carTurnSpeed = 0;
    this.carOdom = 0;
    this.carAng =  -.5 * Math.PI;
    this.carSteering = 0.0;
    this.sensorLeft = 0;
    this.sensorRight = 0;

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

    this.initCar = function(whichGraphic, whichName) {
        this.myBitmap = whichGraphic;
        this.myName = whichName;
        this.carReset();
    }

    this.drawCar = function() {
        drawBitmapCenteredAtLocationWithRotation(this.myBitmap, this.carX, this.carY, this.carAng);
        //colorCircle(this.sensorRight, this.carY, 5, "white");
        //colorCircle(this.sensorLeft, this.carY, 5, "white");
    }

    this.drawCarUI = function() {
        var speedometerX = canvas.width - (UI_TILE_THICKNESS / 2) * TRACK_W;
        var speedometerY = canvas.height - TRACK_H;

        var carSpeedRange = CAR_MAX_SPEED - CAR_MIN_SPEED;
        var carSpeedPerc = this.carSpeed / carSpeedRange;
        var needleLength = TRACK_W * 0.75;
        var needleAng = carSpeedPerc * Math.PI + Math.PI;
        var needleEndX = Math.cos(needleAng) * needleLength + speedometerX;
        var needleEndY = Math.sin(needleAng) * needleLength + speedometerY;

        colorLine(speedometerX, speedometerY, needleEndX, needleEndY, "white");
    }

    this.carReset = function() {
        this.carAng = -0.5 * Math.PI;
        if (this.homeX == undefined) {
            this.homeX = canvas.width / 2;
            this.homeY = canvas.height - CAR_EDGE_MARGIN;
        }

        this.carX = this.homeX;
        this.carY = this.homeY;
    }

    this.carMove = function() {
        var nextX = this.carX;
        var nextY = this.carY;

        var carYRange = this.homeY - CAR_MIN_Y;
        var carSpeedRange = CAR_MAX_SPEED - CAR_MIN_SPEED;

        var carSpeedPerc = this.carSpeed / carSpeedRange;
        nextY = this.homeY - carYRange * carSpeedPerc;

        this.carOdom += this.carSpeed * TRACK_H / 30; //  * 0.2

        var wallBounds = getTrackBoundriesAt(this.carY);
        var wallXLeft = wallBounds.leftSidePixels;
        var wallXRight = wallBounds.rightSidePixels;
        this.sensorLeft = wallXLeft;
        this.sensorRight = wallXRight;
        var carXRange = TRACK_COLS - (wallXLeft + wallXRight);
    
        var steerToward = 0.0;

        if (this.keyHeld_TurnLeft) {
            steerToward = -1.0;

        } else if (this.keyHeld_TurnRight) {
            steerToward = 1.0;
        }

        var minTurnAbility = 0.05;

        if (carSpeedPerc < minTurnAbility) {
            steerToward *= minTurnAbility * 3.0;
        } else {
            steerToward *= carSpeedPerc * 3.0;
        }
        
        if (steerToward > 1.0) {
            steerToward = 1.0;
        } else if (steerToward < -1.0) {
            steerToward = -1.0;
        }

        var kValue = 0.80;
        this.carSteering = kValue * this.carSteering + (1.0-kValue) * steerToward;

        this.carAng = (-0.5 + STRAFE_PIVOT_AMT * this.carSteering) * Math.PI;
        nextX +=  STRAFE_SPEED * this.carSteering;
        this.carY = nextY;

        if (nextX > wallXLeft && nextX< wallXRight)
        {
            // Increase or decrease car's speed when up or down arrow is pushed.
            if (this.keyHeld_Gas) {
                this.carSpeed += CAR_GAS_SPEED;
            } else if (this.keyHeld_Brake) {
                this.carSpeed -= CAR_BRAKE_SPEED;
            }

            if (this.carSpeed > CAR_MAX_SPEED) {
                this.carSpeed = CAR_MAX_SPEED;
            } else if (this.carSpeed < CAR_MIN_SPEED) {
                this.carSpeed = CAR_MIN_SPEED;
            }

            this.carX = nextX;
        } else {
            this.carSpeed *= CAR_HIT_WALL_SPEED;
            if (this.carX < wallXLeft) {
                this.carX = wallXLeft;
            } else if (this.carX > wallXRight) {
                this.carX = wallXRight;
            }// Car off right side
        }// Car hit wall
    }// End of car move

} // End of car class