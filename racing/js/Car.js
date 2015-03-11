const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.03;
const SPEED_DECAY_MULT = 0.94;
const MIN_TURN_SPEED = 0.5;

function carClass() {
    this.carX = 75;
    this.carY = 75;
    this.carAng = Math.PI * -.5;
    this.carSpeed = 0;

    this.keyHeld_Gas = false;
    this.keyHeld_Reverse = false;
    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;

    this.setupControls = function(forwardKey, backKey, leftKey, rightKey) {
        this.controlKeyForGas = forwardKey;
        this.controlKeyForReverse = backKey;
        this.controlKeyForTurnLeft = leftKey;
        this.controlKeyForTurnRight = rightKey;
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
        this.carSpeed = 0;
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
        if (this.keyHeld_Gas) {
            this.carSpeed += DRIVE_POWER;
        }
        if (this.keyHeld_Reverse) {
            this.carSpeed -= REVERSE_POWER;
        }

        if (Math.abs(this.carSpeed) > MIN_TURN_SPEED)
        {
            if (this.keyHeld_TurnLeft) {
                this.carAng -= TURN_RATE * Math.PI;
            }
            if (this.keyHeld_TurnRight) {
                this.carAng += TURN_RATE * Math.PI;
            }
        }

        this.carSpeed *= SPEED_DECAY_MULT;

        var carSpeedX = Math.cos(this.carAng) * this.carSpeed;
        var carSpeedY = Math.sin(this.carAng) * this.carSpeed;
        var nextX = this.carX + carSpeedX;
        var nextY = this.carY + carSpeedY;

        var drivingIntoTileType = getTrackAtPixelCoord(nextX, nextY); 

        if (drivingIntoTileType == TRACK_ROAD)
        {
            // Car constant movement by speed.
            this.carX = nextX;
            this.carY = nextY;
        } else if(drivingIntoTileType == TRACK_GOAL) {
            document.getElementById("debugText").innerHTML = this.myName + " hit the goal line.";
            p1.carReset();
            p2.carReset();

        } else {
            this.carSpeed *= -0.5;
        }
    }
}