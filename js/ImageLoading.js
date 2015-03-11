var carPic = document.createElement("img");
var car2Pic = document.createElement("img");
var trackPic = [];

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad --;

    if (picsToLoad == 0) {
        loadingDoneSoStartGame();
    }
}

function loadImageForTrackCode(trackCode, fileName) {
    trackPic[trackCode] = document.createElement("img");
    beginLoadingImage(trackPic[trackCode], fileName);
}

function loadImages() {
    var imgList = [
    {varName: carPic, theFile: "player1.png"},
    {varName: car2Pic, theFile: "player2.png"},
    {trackType: TRACK_ROAD, theFile: "track_road.png"},
    {trackType: TRACK_WALL, theFile: "track_wall.png"},
    {trackType: TRACK_GOAL, theFile: "track_goal.png"},
    {trackType: TRACK_TREE, theFile: "track_treeWall.png"},
    {trackType: TRACK_FLAG, theFile: "track_flagWall.png"}];

    picsToLoad = imgList.length;

    for (var i = 0; i < imgList.length; i++) {
        if (imgList[i].trackType != undefined) {
            loadImageForTrackCode(imgList[i].trackType, imgList[i].theFile);
        }
        else {
            beginLoadingImage(imgList[i].varName, imgList[i].theFile);
        }
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady();
    imgVar.src = "images/" + fileName;
}