const TRACK_W = 40; // Track collision width.
const TRACK_H = 40; // Track collision height.
const TRACK_COLS = 20; // Number of track columns.
const TRACK_ROWS = 17;
const TRACK_WALL_MARGIN = 1;

var trackVector = [];

// Road slope
const TRACK_ROAD_SLOPE_MIN = 0.2;
const TRACK_ROAD_SLOPE_MAX = 0.4;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MIN = 30;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MAX = 60;
const TRACK_PERC_ANGLED_ROADS = 0.99;
var roadCenterColumn = 6;
var roadXDelta = 0;
var framesTillRoadChange = 0;

// Road thickness
const FRAMES_TILL_ROAD_WIDTH_CHANGE_MIN = 30;
const FRAMES_TILL_ROAD_WIDTH_CHANGE_MAX = 60;
const TRACK_PERC_ROAD_WIDTH_STABLE = 0.70;
const TRACK_ROAD_WIDTH_MIN = 4;
const TRACK_ROAD_WIDTH_MAX = 10;
const TRACK_ROAD_WIDTH_DELTA_MIN = 0.2;
const TRACK_ROAD_WIDTH_DELTA_MAX = 0.5;
var roadWidth = 8;
var roadWidthDelta = 0;
var framesTillRoadWidthChange = 0;

// UI
const UI_TILE_THICKNESS = 4;

function initTrack() {
    for (var i = 0; i < TRACK_ROWS; i++) {
        trackVector.push({colCenter: 9, roadSize: 12});
    }

    for (var i = 0; i < TRACK_ROWS; i++) {
        addToTrackAtTop();
    }

    p1.carOdom = 0;
}

function trackCenterCar () {
    var carRow = Math.floor(p1.carY / TRACK_H);// based carY and some track constants
    var carColTile = trackVector[carRow + 1].colCenter; // figure out which column its in by colcenter from trackvector[row]
    var carNewX = carColTile * TRACK_W; // figure out pixel position from the col tile and track constants.

    p1.carX = carNewX;
}

function trackTileToIndex(tileCol, tileRow) {
    return (tileCol + TRACK_COLS * tileRow);
}

function addToTrackAtTop() {
    trackVector.splice(-1, 1);
    trackVector.unshift({colCenter: roadCenterColumn, roadSize: roadWidth});

    nextTrack();
  
    p1.carOdom -= TRACK_H;
}

function nextTrack() {
    handleRoadSlope();

    handleRoadThickness();

    fixRoad();
}

function getTrackBoundriesAt(carY) {
    var tileRow = (carY + .5 * TRACK_H) / TRACK_H;

    tileRow = Math.floor(tileRow) + 1; // move down one row

    // To avoid index out of bounds make sure it's within the track wall.
    if (tileRow < 0 || tileRow >= TRACK_ROWS) {
        return {leftSidePixels: 0, rightSidePixels: TRACK_COLS};
    }

    var leftWallCurrentRow = trackVector[tileRow].colCenter - 
                             trackVector[tileRow].roadSize / 2;
    var rightWallCurrentRow = trackVector[tileRow].colCenter + 
                              trackVector[tileRow].roadSize / 2;

    var tileNextRow = tileRow - 1;                       
    var leftWallNextRow = trackVector[tileNextRow].colCenter - 
                             trackVector[tileNextRow].roadSize / 2;
    var rightWallNextRow = trackVector[tileNextRow].colCenter + 
                              trackVector[tileNextRow].roadSize / 2;

    var interpPerc = p1.carOdom / TRACK_H;

    var leftReturn = leftWallNextRow * interpPerc +
                     leftWallCurrentRow * (1.0 - interpPerc);
    var rightReturn = rightWallNextRow * interpPerc +
                      rightWallCurrentRow * (1.0 - interpPerc);
    leftReturn *= TRACK_W;
    rightReturn *= TRACK_W;

    return {leftSidePixels: leftReturn, rightSidePixels: rightReturn};
}

function getRandRange(min, max) {
    return min + Math.random() * (max - min);
}

function getUpdateVariance(changedVarString, deltaVarString, framesTillChangeString, minFreq, maxFreq, minDelta, maxDelta, percOfNonZero) {
    window[changedVarString] += window[deltaVarString];
    window[framesTillChangeString] --;

    if (window[framesTillChangeString] < 0) {
        window[framesTillChangeString] = getRandRange(minFreq, maxFreq);
        var roadDirPerc = Math.random();

        if (roadDirPerc < percOfNonZero) { 
            window[deltaVarString] = getRandRange(minDelta, maxDelta);

            if (Math.random() < 0.5) {
                window[deltaVarString] *= -1;
            }
        } else { // Road is straight.
            window[deltaVarString] = 0;
        }
    }

}

function handleRoadSlope() {
    getUpdateVariance("roadCenterColumn",
                      "roadXDelta",
                      "framesTillRoadChange", 
                      FRAMES_TILL_ROAD_SLOPE_CHANGE_MIN, FRAMES_TILL_ROAD_SLOPE_CHANGE_MAX, 
                      TRACK_ROAD_SLOPE_MIN, TRACK_ROAD_SLOPE_MAX,
                      TRACK_PERC_ANGLED_ROADS);
}

function handleRoadThickness() {
    getUpdateVariance("roadWidth",
                      "roadWidthDelta",
                      "framesTillRoadWidthChange", 
                      FRAMES_TILL_ROAD_WIDTH_CHANGE_MIN, FRAMES_TILL_ROAD_WIDTH_CHANGE_MAX, 
                      TRACK_ROAD_WIDTH_DELTA_MIN, TRACK_ROAD_WIDTH_DELTA_MAX,
                      TRACK_PERC_ROAD_WIDTH_STABLE);
}

function fixRoad() {
    if (roadWidth < TRACK_ROAD_WIDTH_MIN) {
        roadWidth = TRACK_ROAD_WIDTH_MIN;
    }

    if (roadWidth > TRACK_ROAD_WIDTH_MAX) {
        roadWidth = TRACK_ROAD_WIDTH_MAX;
    }

    var tooFarLeft = TRACK_WALL_MARGIN + (roadWidth / 2);

    if (roadCenterColumn < tooFarLeft) {

        roadCenterColumn = tooFarLeft;

    }

    var tooFarRight = TRACK_COLS - tooFarLeft - UI_TILE_THICKNESS;

    if (roadCenterColumn > tooFarRight) {

        roadCenterColumn = tooFarRight;

    }
}

function updateTrack() {
    if (p1.carOdom > TRACK_H) {
        addToTrackAtTop();
    }
}

function drawTrackSides(segmentTopLeftX, segmentTopLeftY)
{
        // Area left of left road.
    for (var row = 0; row < trackVector.length; row++) {
        var leftSideTile = trackVector[row].colCenter - trackVector[row].roadSize/2;
        var leftSidePixelX = TRACK_W * leftSideTile;
        var pixelY = segmentTopLeftY + TRACK_H * row;

        canvasContext.beginPath();
        canvasContext.moveTo(0, pixelY);
        canvasContext.lineTo(leftSidePixelX,pixelY);
        canvasContext.stroke();
    }

    // Area right of right road.
    for (var row = 0; row < trackVector.length; row++) {
        var leftSideTile = trackVector[row].colCenter - trackVector[row].roadSize/2;
        var leftSidePixelX = TRACK_W * leftSideTile;
        var rightSidePixelX = leftSidePixelX + TRACK_W * trackVector[row].roadSize;
        var pixelY = segmentTopLeftY + TRACK_H * row;

        canvasContext.beginPath();
        canvasContext.moveTo(canvas.width - UI_TILE_THICKNESS * TRACK_W, pixelY);
        canvasContext.lineTo(rightSidePixelX,pixelY);
        canvasContext.stroke();
    }

}

function drawTrack() {
    var trackIndex = 0;
    var segmentTopLeftX = 0;
    var segmentTopLeftY = p1.carOdom - TRACK_H;
    canvasContext.strokeStyle="white";

    segmentTopLeftY = p1.carOdom - TRACK_H;

    drawTrackSides(segmentTopLeftX, segmentTopLeftY);

    // Fix this edge case, of top most and bottom most track lines.
    canvasContext.beginPath();
    var leftSideTile = trackVector[0].colCenter - trackVector[0].roadSize/2;
    var leftSidePixelX = TRACK_W * leftSideTile;

    canvasContext.moveTo(leftSidePixelX, 0);
    for (var row = 0; row < trackVector.length; row++) {
        leftSideTile = trackVector[row].colCenter - trackVector[row].roadSize/2;
        leftSidePixelX = TRACK_W * leftSideTile;
        var pixelY = segmentTopLeftY + TRACK_H * row;


        canvasContext.lineTo(leftSidePixelX,pixelY);

    }
    canvasContext.strokeStyle="yellow";
    canvasContext.stroke();

    canvasContext.beginPath();
    var rightSideTile = trackVector[0].colCenter + trackVector[0].roadSize/2;
    var rightSidePixelX = TRACK_W * rightSideTile;
    canvasContext.moveTo(rightSidePixelX, 0);
    for (var row = 0; row < trackVector.length; row++) {
        rightSideTile = trackVector[row].colCenter + trackVector[row].roadSize/2;
        rightSidePixelX = TRACK_W * rightSideTile;
        var pixelY = segmentTopLeftY + TRACK_H * row;


        canvasContext.lineTo(rightSidePixelX,pixelY);
    }
    canvasContext.strokeStyle="yellow";
    canvasContext.stroke();
} // End of func