//var maxCars = 10;//4
//var spawnFreq = 0.2;//.02
//const CAR_MAX_SPEED = 16;//13
//const CAR_GAS_SPEED = 0.3;//0.21;
const TRACK_ROAD_WIDTH_MIN = 4;//4;
const TRACK_ROAD_WIDTH_MAX = 8;//10;
const FRAMES_TILL_ROAD_WIDTH_CHANGE_MIN = 100;//30;
const FRAMES_TILL_ROAD_WIDTH_CHANGE_MAX = 130;//60;
const TRACK_ROAD_SLOPE_MIN = 0.2;
const TRACK_ROAD_SLOPE_MAX = 0.4;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MIN = 30;
const FRAMES_TILL_ROAD_SLOPE_CHANGE_MAX = 60;
const TRACK_PERC_ANGLED_ROADS = .01;//0.99;

var stageOne = {
    "color": "#00ff00",
    "maxCars": 4,
    "spawnFreq": 0.02,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "framesTillRoadChangeMin": 100,
    "framesTillRaodChangeMax": 130,
    "startDistance": 0.0
}

var stageTwo = {
    "color": "#ff0000",
    "maxCars": 100,
    "spawnFreq": 0.5,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "framesTillRoadChangeMin": 100,
    "framesTillRaodChangeMax": 130,
    "startDistance": 3
}

var stageThree = {
    "color": "#00ffff",
    "maxCars": 4,
    "spawnFreq": 0.02,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "trackMinThickness": 4,
    "trackMaxThickness": 10,
    "framesTillRoadChangeMin": 100,
    "framesTillRaodChangeMax": 130,
    "startDistance": 6
}

var stageFour = {
    "color": "#ffbbbb",
    "maxCars": 4,
    "spawnFreq": 0.02,
    "gasSpeed": 0.4,
    "maxSpeed": 19,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "framesTillRoadChangeMin": 100,
    "framesTillRaodChangeMax": 130,
    "startDistance": 9
}

var stageTuning = [stageOne, stageTwo, stageThree, stageFour];
var stageNow = 0;