const TRACK_W = 40; // Track collision width.
const TRACK_H = 40; // Track collision height.
const TRACK_COLS = 20; // Number of track columns.
const TRACK_ROWS = 15;
var trackGrid = 
[4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
 1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
 1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
 1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 5, 0, 0, 1, 0, 0, 1, 0, 0, 1,
 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
 1, 1, 5, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
 0, 3, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
 0, 3, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
 1, 1, 5, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1];

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;

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

    // To aoid index out of bounds make sure it's within the track wall.
    if (tileCol < 0 || tileCol >= TRACK_COLS ||
        tileRow < 0 || tileRow >= TRACK_ROWS) {
        return TRACK_WALL;
    }

    var trackIndex = trackTileToIndex(tileCol, tileRow);

    return (trackGrid[trackIndex]);
}

function drawTrack() {
    var trackIndex = 0;
    var segmentTopLeftX = 0;
    var segmentTopLeftY = 0;

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