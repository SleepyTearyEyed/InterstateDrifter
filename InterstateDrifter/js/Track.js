const TRACK_W = 40; // Track collision width.
const TRACK_H = 40; // Track collision height.
const TRACK_COLS = 20; // Number of track columns.
const TRACK_ROWS = 16;
const TRACK_WALL_MARGIN = 1;

var trackGrid = 
[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;

// Road slope
const TRACK_ROAD_SLOPE_MIN = 0.2;
const TRACK_ROAD_SLOPE_MAX = 1.4;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MIN = 30;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MAX = 60;
const TRACK_PERC_ANGLED_ROADS = 0.70;
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

function trackTileToIndex(tileCol, tileRow) {
    return (tileCol + TRACK_COLS * tileRow);
}

function isWallAtTileCoord(trackTileCol, trackTileRow) {
    var trackIndex = trackTileToIndex(trackTileCol, trackTileRow);
    return (trackGrid[trackIndex] == TRACK_WALL);
}

function getTrackAtPixelCoord(pixelX, pixelY) {
    var tileCol = pixelX / TRACK_W;
    var tileRow = pixelY / TRACK_H;

    tileCol = Math.floor(tileCol);
    tileRow = Math.floor(tileRow);

    // To avoid index out of bounds make sure it's within the track wall.
    if (tileCol < 0 || tileCol >= TRACK_COLS ||
        tileRow < 0 || tileRow >= TRACK_ROWS) {
        return TRACK_WALL;
    }

    var trackIndex = trackTileToIndex(tileCol, tileRow);

    return (trackGrid[trackIndex]);
}

function addToTrackAtTop() {
    trackGrid.splice(-TRACK_COLS, TRACK_COLS);

    var nextTrack = getNextTrack();

    for (var i = 0; i < TRACK_COLS; i++) {
        trackGrid.unshift(nextTrack.pop());
    }
    
    p1.carOdom -= TRACK_H;
}

function getNextTrack() {
    //var nextTrack = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1];
    var nextTrack = [];

    var firstRoadCol = Math.floor(roadCenterColumn - (roadWidth / 2));

    for(var i = 0; i < firstRoadCol; i++) {
        nextTrack.push(TRACK_WALL);
    }

    for(var i = 0; i < roadWidth; i++) {
        nextTrack.push(TRACK_ROAD);

    }

    while (nextTrack.length < TRACK_COLS) {
        nextTrack.push(TRACK_WALL);
    }

    for(var i = 0; i < TRACK_WALL_MARGIN; i++) {
        nextTrack.pop();
        nextTrack.shift();
    }

    for(var i = 0; i < TRACK_WALL_MARGIN; i++) {
        nextTrack.push(TRACK_WALL);
        nextTrack.unshift(TRACK_WALL);
    }

    handleRoadSlope();

    handleRoadThickness();

    fixRoad();

    return nextTrack;
}

function getTrackBoundriesAt(carY) {
    var tileRow = carY / TRACK_H;

    tileRow = Math.floor(tileRow);

    // To avoid index out of bounds make sure it's within the track wall.
    if (tileRow < 0 || tileRow >= TRACK_ROWS) {
        return {leftSide: 0, rightSide: TRACK_COLS};
    }

    var leftReturn = -1;
    var rightReturn = -1;

    for (var column = 0; column < TRACK_COLS; column ++) {
        var trackIndex = trackTileToIndex(column, tileRow);
        var trackType = trackGrid[trackIndex];

        if (leftReturn != -1) {
            if (trackType == TRACK_WALL) {
                rightReturn = column;
                console.log(rightReturn);
                break;
            }
        } else if (trackType == TRACK_ROAD) {
            leftReturn = column;
        }
    }

    return {leftSide: leftReturn, rightSide: rightReturn};
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
        framesTillRoadChange = -1;

    }

    var tooFarRight = TRACK_COLS - tooFarLeft;

    if (roadCenterColumn > tooFarRight) {
        roadCenterColumn = tooFarRight;
        framesTillRoadChange = -1;
    }
}

function updateTrack() {
    if (p1.carOdom > TRACK_H) {
        addToTrackAtTop();
    }
}

function drawTrack() {
    var trackIndex = 0;
    var segmentTopLeftX = 0;

    var segmentTopLeftY = p1.carOdom - TRACK_H;

    for (var row = 0; row < TRACK_ROWS; row++) {
        for (var column = 0; column < TRACK_COLS; column ++) {

            var trackType = trackGrid[trackIndex];

            canvasContext.drawImage(trackPic[trackType], segmentTopLeftX, segmentTopLeftY);
            segmentTopLeftX += TRACK_W;
            trackIndex++;
        } // End of column for
        segmentTopLeftX = 0;
        segmentTopLeftY += TRACK_H;
    } // End of row for
} // End of func