const TRACK_W = 40; // Track collision width.
const TRACK_H = 40; // Track collision height.
const TRACK_GAP = 1; // Visual gap between trak segments.
const TRACK_COLS = 20; // Number of track columns.
const TRACK_ROWS = 15;
var trackGrid = 
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 
1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 
1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 
1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 
1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 
1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
1, 2, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 
1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 
1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER = 2;

function trackTileToIndex(tileCol, tileRow) {
    return (tileCol + TRACK_COLS * tileRow);
}

function isWallAtTileCoord(trackTileCol, trackTileRow) {
    var trackIndex = trackTileToIndex(trackTileCol, trackTileRow);
    return (trackGrid[trackIndex] == TRACK_WALL);
}

function checkForTrackAtPixelCoord(pixelX, pixelY) {
    var tileCol = pixelX / TRACK_W;
    var tileRow = pixelY / TRACK_H;

    tileCol = Math.floor(tileCol);
    tileRow = Math.floor(tileRow);

    // To aoid index out of bounds make sure it's within the track wall.
    if (tileCol < 0 || tileCol >= TRACK_COLS ||
        tileRow < 0 || tileRow >= TRACK_ROWS) {
        return false;
    }

    var trackIndex = trackTileToIndex(tileCol, tileRow);

    return (trackGrid[trackIndex] == TRACK_ROAD);
}

function drawTrack() {
    for (var row = 0; row < TRACK_ROWS; row++) {
        for (var column = 0; column < TRACK_COLS; column ++) {
            if (isWallAtTileCoord(column, row)) {
                var trackSegmentTopLeftX = column * TRACK_W;
                var trackSegmentTopLeftY = row * TRACK_H;
            
                colorRect(trackSegmentTopLeftX, trackSegmentTopLeftY, TRACK_W - TRACK_GAP, TRACK_H - TRACK_GAP, 'blue');
            }
        }
    }
}