var canvas;
var canvasContext;

// The player as represented by the car.
var p1 = new carClass();

window.onload = function() {
    // Gets the canvas tag from html id = gameCanvas. 
    // Resolution set to 800 X 600 in html tag.
    canvas = document.getElementById('gameCanvas');
    // Using CanvasRenderingContext2D.
    canvasContext = canvas.getContext('2d');

    // Need to load all the images at the beginning before starting gameplay.
    loadImages();
}

function loadingDoneSoStartGame() {
    // Typical framerate for the web.
    var framesPerSecond = 30;

    // The game loop.
    // setInterval calls a function every N number of milliseconds.
    setInterval(function() // Anonymous function for calling multiple functions for each interval.
        {
            moveEverything();
            drawEverything();
        }, 1000 / framesPerSecond); // 1000 equals one sec. Divide by frames to get fps.

    // Initialize the car.
    p1.initCar(carPic, "Drifter");
    // Initialize input.
    initInput();
    // Initialize the moving level.
    initTrack();
}
// Everything gets moved then drawn. 
// Updating the car's position and the level first then draw them on screen.
function moveEverything() {
    p1.carMove();
    updateTrack();
}

function drawEverything() {
    drawTrack();
    p1.drawCar();
    p1.drawCarUI();
}