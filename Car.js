var carX = 75;
var carY = 75;
var carAng = Math.PI * -.5;
var carSpeed = 0;
var carPic = document.createElement("img");
var carPicLoaded = false;

const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.03;
const SPEED_DECAY_MULT = 0.94;
const MIN_TURN_SPEED = 0.5;

function drawCar() {
    if (carPicLoaded) {
        drawBitmapCenteredAtLocationWithRotation(carPic, carX, carY, carAng);
    }
}

function carReset() {
    for (var i = 0; i < trackGrid.length; i ++)
    {
        if (trackGrid[i] == TRACK_PLAYER) {
            trackGrid[i] = TRACK_ROAD;

            var tileCol =  i % TRACK_COLS;
            var tileRow = Math.floor(i / TRACK_COLS);
            carX = tileCol * TRACK_W + (TRACK_W / 2);
            carY = tileRow * TRACK_H + (TRACK_H / 2);

            break;
        }
    }
}