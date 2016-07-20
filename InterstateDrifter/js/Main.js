var canvas;
var canvasContext;
var zoom = 1;
var zoomGoal = 1;
var timeTenths;
var attractLoop = true;
var currentScore = 0;
const RACE_TIME_SECONDS = 30;
const TENTHS_PER_SECOND = 10;
const CAR_PASS_NORTHBOUND_SCORE_BONUS = 50;
const CAR_PASS_SOUTHBOUND_SCORE_BONUS = 10;

// The player as represented by the car.
var p1 = new carClass();
var trafficCars = [];

//Audio
var backgroundMusic = new BackgroundMusicClass();

window.onload = function() {
    // Gets the canvas tag from html id = gameCanvas. 
    // Resolution set to 800 X 600 in html tag.
    canvas = document.getElementById('gameCanvas');
    // Using CanvasRenderingContext2D.
    canvasContext = canvas.getContext('2d');

    setupTrafficCarImage();
    // Need to load all the images at the beginning before starting gameplay.
    loadImages();

    //backgroundMusic.loopSong("music/saddened");
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
    zoom = stageTuning[stageNow].zoomMin;
    trafficCars = [];
    stageNow = 0;
    currentScore = 0;
}

function resetTimer(){
    timeTenths = RACE_TIME_SECONDS * TENTHS_PER_SECOND;
}

// Everything gets moved then drawn. 
// Updating the car's position and the level first then draw them on screen.
function moveEverything() {
    updateTrack();
    p1.carMove();

    if (trafficCars.length < stageTuning[stageNow].maxCars && Math.random() < stageTuning[stageNow].spawnFreq) {
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
    //zoom = .35; // To debug boundaries.
    canvasContext.scale(zoom, zoom);
    canvasContext.translate(-p1.carX, -p1.carY);
    zoomGoal = stageTuning[stageNow].zoomMin + (1.0 - p1.carSpeed / stageTuning[stageNow].maxSpeed) * (stageTuning[stageNow].zoomMax - stageTuning[stageNow].zoomMin);
    zoom = zoom * 0.9 + zoomGoal * 0.1;
    drawTrack();
    p1.drawCar();

    for (var i = 0; i < trafficCars.length; i ++) {
        trafficCars[i].draw();
    }

    canvasContext.restore();
    drawCarUI(p1);

    outlineRect(0,0, canvas.width,canvas.height, stageTuning[stageNow].color);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}