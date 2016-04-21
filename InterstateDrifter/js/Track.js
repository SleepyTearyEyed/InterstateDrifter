const TRACK_W = 40; // Track collision width.
const TRACK_H = 40; // Track collision height.
const TRACK_COLS = 20; // Number of track columns.
const TRACK_ROWS = 36;
const TRACK_WALL_MARGIN = 1;

var trackVector = [];

// Road slope
var roadCenterColumn = 6;
var roadXDelta = 0;
var framesTillRoadChange = 0;

// Road thickness
const TRACK_PERC_ROAD_WIDTH_STABLE = 0.70;
const TRACK_ROAD_WIDTH_DELTA_MIN = 0.2;
const TRACK_ROAD_WIDTH_DELTA_MAX = 0.5;
const TRACK_ROAD_WIDTH_MIN_FOR_4_LANES = 8;
var roadWidth = 8;
var roadWidthDelta = 0;
var framesTillRoadWidthChange = 0;

// UI
const UI_TILE_THICKNESS = 4;

// Track colors
var centerLineColor = "yellow";
var dashLineColor = "gray";
var edgeLineColor = "red";
var trackLineColor = "white";

function initTrack() {
    trackVector = [];
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
    if (tileRow < 0) {
        //console.log("Tried to set boundries outside of track data.\n carY=" + carY + "\n" + "tileRow=" + tileRow);
        //return {leftSidePixels: 0, rightSidePixels: TRACK_COLS};
        tileRow = 0;
    }
    else if (tileRow >= TRACK_ROWS) {
        tileRow = TRACK_ROWS - 1;
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

    /*console.log("leftWallCurrentRow=" + leftWallCurrentRow + "\ntileNextRow=" + 
                 tileNextRow + "\nleftWallNextRow=" + leftWallNextRow + "\ninterpPerc=" + interpPerc +
                 "\nleftReturn=" + leftReturn + "\nrightReturn=" + rightReturn);*/
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

function drawNonRoad(segmentTopLeftX, segmentTopLeftY)
{
    var lineOverdrawLen = 600;
    canvasContext.lineWidth = 1;
        // Area left of left road.
    for (var row = 0; row < trackVector.length; row++) {
        var leftSideTile = trackVector[row].colCenter - trackVector[row].roadSize/2;
        var leftSidePixelX = TRACK_W * leftSideTile;
        var pixelY = segmentTopLeftY + TRACK_H * row;

        canvasContext.beginPath();
        canvasContext.moveTo(-lineOverdrawLen, pixelY);
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
        canvasContext.moveTo(canvas.width - UI_TILE_THICKNESS * TRACK_W + lineOverdrawLen, pixelY);
        canvasContext.lineTo(rightSidePixelX,pixelY);
        canvasContext.stroke();
    }

}

// -1 for left side of the road 1 for right side.
function drawRoadEdge(segmentTopLeftY, roadSideMult, roadColor) {
    // Fix this edge case, of top most and bottom most track lines.
    canvasContext.beginPath();
    var sideTile = trackVector[0].colCenter + roadSideMult * trackVector[0].roadSize/2;
    var sidePixelX = TRACK_W * sideTile;

    canvasContext.moveTo(sidePixelX, 0);
    for (var row = 0; row < trackVector.length; row++) {
        sideTile = trackVector[row].colCenter + roadSideMult * trackVector[row].roadSize/2;
        sidePixelX = TRACK_W * sideTile;
        var pixelY = segmentTopLeftY + TRACK_H * row;


        canvasContext.lineTo(sidePixelX,pixelY);

    }
    canvasContext.strokeStyle= roadColor;
    canvasContext.stroke();
}

function drawRoadEdgeSpecial(segmentTopLeftY, roadSideMult, roadColor) {
    var sideTile = trackVector[0].colCenter + roadSideMult * trackVector[0].roadSize/2;
    var sidePixelX = TRACK_W * sideTile;
    var pixelY = 0;
    var prevX = 0;
    var prevY = 0;

    //document.getElementById("debugText").innerHTML = "";
    for (var row = 0; row < trackVector.length; row++) {
        //document.getElementById("debugText").innerHTML += trackVector[row].roadSize;
        //document.getElementById("debugText").innerHTML += "<br>";
        if (trackVector[row].roadSize >= TRACK_ROAD_WIDTH_MIN_FOR_4_LANES) {
            canvasContext.beginPath();
            canvasContext.moveTo(sidePixelX, pixelY);
            prevX = sidePixelX;
            prevY = pixelY;
        }
            sideTile = trackVector[row].colCenter + roadSideMult * trackVector[row].roadSize/2;
            sidePixelX = TRACK_W * sideTile;
            pixelY = segmentTopLeftY + TRACK_H * row;

        if (trackVector[row].roadSize >= TRACK_ROAD_WIDTH_MIN_FOR_4_LANES) {
            var avgX = prevX * 0.5 + sidePixelX * 0.5;
            var avgY = prevY * 0.5 + pixelY * 0.5;
            canvasContext.lineTo(avgX,avgY);
            canvasContext.strokeStyle= roadColor;
            canvasContext.stroke();
        }
    }
}

function drawLeftRoadEdge(segmentTopLeftY) {
    drawRoadEdge(segmentTopLeftY, -1, edgeLineColor);
}

function drawRightRoadEdge(segmentTopLeftY) {
    drawRoadEdge(segmentTopLeftY, 1, edgeLineColor);
}

function drawCenterLine(segmentTopLeftY) {
    drawRoadEdge(segmentTopLeftY, -0.02, centerLineColor);
    drawRoadEdge(segmentTopLeftY, 0.02, centerLineColor);
    drawRoadEdgeSpecial(segmentTopLeftY, -.5, dashLineColor);
    drawRoadEdgeSpecial(segmentTopLeftY, .5, dashLineColor);
}

function drawTrack() {
    var trackIndex = 0;
    var segmentTopLeftX = 0;
    var segmentTopLeftY = p1.carOdom - TRACK_H;
    canvasContext.strokeStyle=trackLineColor;

    segmentTopLeftY = p1.carOdom - TRACK_H;

    drawNonRoad(segmentTopLeftX, segmentTopLeftY);

    canvasContext.lineWidth = 1.5;
    drawLeftRoadEdge(segmentTopLeftY);
    drawRightRoadEdge(segmentTopLeftY);

    canvasContext.lineWidth = 1;
    drawCenterLine(segmentTopLeftY);
} // End of func