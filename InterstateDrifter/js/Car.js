const STRAFE_MAX_SPEED = 6;
const STRAFE_MIN_SPEED = 0;
const STRAFE_SPEED = 6;
const STRAFE_PIVOT_AMT = 0.20;

const CAR_MAX_SPEED = 13;
const CAR_MIN_SPEED = 0;
const CAR_GAS_SPEED = 0.18;
const CAR_BRAKE_SPEED = 0.22;

const CAR_MIN_Y = 400;

function carClass() {
    this.carX = 75;
    this.carY = 75;
    this.carSpeed = 0;
    this.carTurnSpeed = 0;
    this.carOdom = 0;
    this.carAng =  -.5 * Math.PI;

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
    }

    this.carReset = function() {
        this.carAng = -0.5 * Math.PI;
        if (this.homeX == undefined) {
            for (var i = 0; i < trackGrid.length; i ++)
            {
                if (trackGrid[i] == TRACK_PLAYER) {
                    trackGrid[i] = TRACK_ROAD;

                    var tileCol =  i % TRACK_COLS;
                    var tileRow = Math.floor(i / TRACK_COLS);
                    this.homeX = tileCol * TRACK_W + (TRACK_W / 2);
                    this.homeY = tileRow * TRACK_H + (TRACK_H / 2);

                    break;
                }
            }
        }

        this.carX = this.homeX;
        this.carY = this.homeY;
    }

    this.carMove = function() {
        var nextX = this.carX;
        var nextY = this.carY;

        var carYRange = this.homeY - CAR_MIN_Y;
        var carSpeedRange = CAR_MAX_SPEED - CAR_MIN_SPEED;

        nextY = this.homeY - carYRange * (this.carSpeed / carSpeedRange);

        this.carOdom += this.carSpeed * TRACK_H / 30; //  * 0.2

        var wallBounds = getTrackBoundriesAt(this.carY);
        var wallXLeft = wallBounds.leftSide * TRACK_W;
        var wallXRight = wallBounds.rightSide * TRACK_W;
        var carXRange = TRACK_COLS - (wallXLeft + wallXRight);
    
        if (this.carSpeed > CAR_MIN_SPEED) {
            if (this.keyHeld_TurnLeft) {
                nextX -= STRAFE_SPEED;
                this.carAng = -(.5 + STRAFE_PIVOT_AMT) * Math.PI
            } else if (this.keyHeld_TurnRight) {
                nextX += STRAFE_SPEED;
                this.carAng = -(.5 - STRAFE_PIVOT_AMT) * Math.PI;
            } else {
                this.carAng = -.5 * Math.PI;
            }
        }

        var drivingIntoTileType = getTrackAtPixelCoord(nextX, nextY + TRACK_H - this.carOdom);

        if (drivingIntoTileType == TRACK_ROAD)
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
            this.carY = nextY;
        } else {
            /*var wallBounds = getTrackBoundriesAt(this.carY);
            var wallXLeft = wallBounds.leftSide * TRACK_W;
            var wallXRight = wallBounds.rightSide * TRACK_W;*/
            
            if (this.carX < wallXLeft) {
                this.carX = wallXLeft;
            } else if (this.carX > wallXRight) {
                this.carX = wallXRight;
            }// Car off right side
        }// Car hit wall
    }// End of car move

} // End of car class