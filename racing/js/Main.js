var canvas;
var canvasContext;

var p1 = new carClass();
var p2 = new carClass();

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    loadImages();
};

function loadingDoneSoStartGame() {
    var framesPerSecond = 30;
    // Calls function every N number of milliseconds.
    setInterval(function() // Anonymous function for calling multiple functions for each interval.
        {
            moveEverything();
            drawEverything();
        }, 1000/framesPerSecond); // 1000 equals one sec. Divide by frames to get fps.

    p2.initCar(car2Pic, "Orange Car");
    p1.initCar(carPic, "Blue Car");
    
    initInput();
}

function drawEverything() {
    drawTrack();

    p1.drawCar();
    p2.drawCar();
}

function moveEverything() {
    p1.carMove();
    p2.carMove();
}