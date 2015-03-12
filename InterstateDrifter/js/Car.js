const STRAFE_SPEED = 6;

function carClass() {
    this.carX = 75;
    this.carY = 75;
    this.carAng =  -.5 * Math.PI;

    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;

    this.setupControls = function(leftKey, rightKey) {
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
        
        if (this.keyHeld_TurnLeft) {
            nextX -= STRAFE_SPEED;
            this.carAng = -.56 * Math.PI
        } else if (this.keyHeld_TurnRight) {
            nextX += STRAFE_SPEED;
            this.carAng =  -.42 * Math.PI;
        }

        var drivingIntoTileType = getTrackAtPixelCoord(nextX, this.carY);

        if (drivingIntoTileType == TRACK_ROAD)
        {
            this.carX = nextX;
        } else {
            
        }

        if (!this.keyHeld_TurnLeft && !this.keyHeld_TurnRight) {
            this.carAng = -.5 * Math.PI;
        }
    }
}