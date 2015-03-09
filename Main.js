var canvas;
var canvasContext;

window.onload = function() {            
    // Save the canvas for dimensions and its 2d context for drawing to it.
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    // Calls function every N number of milliseconds.
    setInterval(function() // Anonymous function for calling multiple functions for each interval.
        {
            moveEverything();
            drawEverything();
        }, 1000/framesPerSecond); // 1000 equals one sec. Divide by frames to get fps.

    // Load car image.
    carPic.onload = function() {
        carPicLoaded = true; // Don't display it until it's loaded.
    }
    carPic.src="player1.png";

    carReset();

    initInput();
}

function drawEverything() {
    // Black out the screen before drawing everything.
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    drawTrack();

    // Draw the car.
    drawCar();
}

function moveEverything() {
    //carAng += 0.04;
    //carSpeed += 0.02;

    if (keyHeld_Gas) {
        carSpeed += DRIVE_POWER;
    }
    if (keyHeld_Reverse) {
        carSpeed -= REVERSE_POWER;
    }

    if (Math.abs(carSpeed) > MIN_TURN_SPEED)
    {
        if (keyHeld_TurnLeft) {
            carAng -= TURN_RATE * Math.PI;
        }
        if (keyHeld_TurnRight) {
            carAng += TURN_RATE * Math.PI;
        }
    }

    carSpeed *= SPEED_DECAY_MULT;

    var carSpeedX = Math.cos(carAng) * carSpeed;
    var carSpeedY = Math.sin(carAng) * carSpeed;
    var nextX = carX + carSpeedX;
    var nextY = carY + carSpeedY;

    if (checkForTrackAtPixelCoord(nextX, nextY))
    {
        // Car constant movement by speed.
        carX = nextX;
        carY = nextY;
    } else {
        carSpeed = carSpeed * -0.5;
    }
}