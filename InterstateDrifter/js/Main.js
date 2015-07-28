var canvas;
var canvasContext;

// The player as represented by the car.
var p1 = new carClass();
var trafficCars = [];

window.onload = function() {
    // Gets the canvas tag from html id = gameCanvas. 
    // Resolution set to 800 X 600 in html tag.
    canvas = document.getElementById('gameCanvas');
    // Using CanvasRenderingContext2D.
    canvasContext = canvas.getContext('2d');

    setupTrafficCarImage();
    // Need to load all the images at the beginning before starting gameplay.
    loadImages();
}

function spawnTrafficCar() {
    var tempCar = new trafficCarClass();

    tempCar.init();
    trafficCars.push(tempCar);
}

function loadingDoneSoStartGame() {
    // Typical framerate for the web.
    var framesPerSecond = 30;

    initTrack();
    // Player car.
    p1.initCar("Drifter");

    initInput();

    // The game loop.
    // setInterval calls a function every N number of milliseconds.
    setInterval(function() // Anonymous function for calling multiple functions for each interval.
    {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond); // 1000 equals one sec. Divide by frames to get fps.
}
// Everything gets moved then drawn. 
// Updating the car's position and the level first then draw them on screen.
function moveEverything() {
    updateTrack();
    p1.carMove();

    if (trafficCars.length < 4 && Math.random() < 0.02) {
        spawnTrafficCar();
    }
    
    for (var i = 0; i < trafficCars.length; i ++) {
        trafficCars[i].move();
    }

    for (var i = trafficCars.length-1; i >= 0; i--) {
        if (trafficCars[i].readyToRemove) {
            trafficCars.splice(i, 1);
        }
    }
}

function drawEverything() {
    drawTrack();
    p1.drawCar();
    p1.drawCarUI();

    for (var i = 0; i < trafficCars.length; i ++) {
        trafficCars[i].draw();
    }
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}