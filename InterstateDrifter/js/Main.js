var canvas;
var canvasContext;
var zoom = 1;
var zoomGoal = 1;
var timeTenths;
var attractLoop = true;
const ZOOM_MAX = 1.5;
const ZOOM_MIN = 0.5;
const RACE_TIME_SECONDS = 10;
const TENTHS_PER_SECOND = 10;

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
    resetTimer();
    initInput();

    // The game loop.
    // setInterval calls a function every N number of milliseconds.
    setInterval(function() // Anonymous function for calling multiple functions for each interval.
    {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond); // 1000 equals one sec. Divide by frames to get fps.

    setInterval(function()
    {
        if (attractLoop == false) {
            timeTenths--;
            if (timeTenths < 0) {
                timeTenths = 0;
                attractLoop = true;
            }
        }
    }, 100);
}

function reset(){
    initTrack();
    // Player car.
    p1.carReset();
    trackCenterCar();
    resetTimer();
    zoom = ZOOM_MIN;
    trafficCars = [];
}

function resetTimer(){
    timeTenths = RACE_TIME_SECONDS * TENTHS_PER_SECOND;
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
        for (var ii = i+1; ii < trafficCars.length; ii ++) {
            var laneDiff = Math.abs(trafficCars[i].lanePerc - trafficCars[ii].lanePerc);

            if (laneDiff < 0.1) {
                var yDiff = Math.abs(trafficCars[i].y - trafficCars[ii].y);

                if (yDiff <= CLOSE_ENOUGH_TO_AVOID) {
                    var futureYDiff = Math.abs((trafficCars[i].y - trafficCars[i].speed) - 
                                      (trafficCars[ii].y - trafficCars[ii].speed));
                    if (yDiff > futureYDiff) {
                        var tempSpeedI = trafficCars[i].speed;

                        trafficCars[i].speed = trafficCars[ii].speed;
                        trafficCars[ii].speed = tempSpeedI;
                        //console.log("bumped" + i + " : " + ii);
                    }
                }
            }
        }
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
    var gameAreaWidth = canvas.width - UI_TILE_THICKNESS * TRACK_W;

    clearScreen();
    canvasContext.save();
    canvasContext.translate(gameAreaWidth/2, p1.carY - canvas.height);
    //zoom = 0.2; // To debug boundaries.
    canvasContext.scale(zoom, zoom);
    canvasContext.translate(-p1.carX, -p1.carY);
    zoomGoal = ZOOM_MIN + (1.0 - p1.carSpeed / CAR_MAX_SPEED) * (ZOOM_MAX - ZOOM_MIN);
    zoom = zoom * 0.9 + zoomGoal * 0.1;
    drawTrack();
    p1.drawCar();

    for (var i = 0; i < trafficCars.length; i ++) {
        trafficCars[i].draw();
    }

    canvasContext.restore();
    drawCarUI(p1);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}