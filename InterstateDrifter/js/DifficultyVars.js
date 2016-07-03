//var maxCars = 10;//4
//var spawnFreq = 0.2;//.02
//const CAR_MAX_SPEED = 16;//13
//const CAR_GAS_SPEED = 0.3;//0.21;
//const TRACK_ROAD_WIDTH_MIN = 4;//4;
//const TRACK_ROAD_WIDTH_MAX = 8;//10;
//const FRAMES_TILL_ROAD_WIDTH_CHANGE_MIN = 100;//30;
//const FRAMES_TILL_ROAD_WIDTH_CHANGE_MAX = 130;//60;
//const TRACK_ROAD_SLOPE_MIN = 0.2;
//const TRACK_ROAD_SLOPE_MAX = 0.4;
//const FRAMES_TILL_ROAD_SLOPE_CHANGE_MIN = 30;
//const FRAMES_TILL_ROAD_SLOPE_CHANGE_MAX = 60;
//const TRACK_PERC_ANGLED_ROADS = .01;//0.99;
//const ZOOM_MAX = 1.5;
//const ZOOM_MIN = 0.5;

var stageOne = {
    "color": "#00ff00",
    "maxCars": 4,
    "spawnFreq": 0.02,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "carAngDampen": 1.0,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "trackRoadSlopeMin": 0.2,
    "trackRoadSlopeMax": 0.4,
    "trackPercAngledRoads": .01,
    "framesTillRoadChangeMin": 100,
    "framesTillRoadChangeMax": 130,
    "framesTillRoadSlopeChangeMin": 20,
    "framesTillRoadSlopeChangeMax": 50,
    "framesTillTrafficCarsLaneChangeMin": 60,
    "framesTillTrafficCarsLaneChangeMax": 120,
    "startDistance": 0.0,
    "zoomMin": 0.5,
    "zoomMax": 1.5
}

var stageTwo = {
    "color": "#ff0000",
    "maxCars":  12,
    "spawnFreq": 0.15,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "carAngDampen": 1.0,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "trackRoadSlopeMin": 0.2,
    "trackRoadSlopeMax": 0.4,
    "trackPercAngledRoads": .2,
    "framesTillRoadChangeMin": 100,
    "framesTillRoadChangeMax": 130,
    "framesTillRoadSlopeChangeMin": 20,
    "framesTillRoadSlopeChangeMax": 50,
    "framesTillTrafficCarsLaneChangeMin": 60,
    "framesTillTrafficCarsLaneChangeMax": 120,
    "startDistance": 3,
    "zoomMin": 0.5,
    "zoomMax": 1.5
}

var stageThree = {
    "color": "#00ffff",
    "maxCars": 6,
    "spawnFreq": 0.08,
    "gasSpeed": 0.21,
    "maxSpeed": 13,
    "carAngDampen": 1.0,
    "trackMinThickness": 5,
    "trackMaxThickness": 10,
    "trackRoadSlopeMin": 0.2,
    "trackRoadSlopeMax": 0.4,
    "trackPercAngledRoads": .99,
    "framesTillRoadChangeMin": 15,
    "framesTillRoadChangeMax": 20,
    "framesTillRoadSlopeChangeMin": 20,
    "framesTillRoadSlopeChangeMax": 50,
    "framesTillTrafficCarsLaneChangeMin": 60,
    "framesTillTrafficCarsLaneChangeMax": 120,
    "startDistance": 6,
    "zoomMin": 0.5,
    "zoomMax": 1.5
}

var stageFour = {
    "color": "#ffbbbb",
    "maxCars": 4,
    "spawnFreq": 0.02,
    "gasSpeed": 0.4,
    "maxSpeed": 16,
    "carAngDampen": 0.5,
    "trackMinThickness": 8,
    "trackMaxThickness": 10,
    "trackRoadSlopeMin": 0.2,
    "trackRoadSlopeMax": 0.4,
    "trackPercAngledRoads": .99,
    "framesTillRoadChangeMin": 100,
    "framesTillRoadChangeMax": 130,
    "framesTillRoadSlopeChangeMin": 20,
    "framesTillRoadSlopeChangeMax": 50,
    "framesTillTrafficCarsLaneChangeMin": 60,
    "framesTillTrafficCarsLaneChangeMax": 120,
    "startDistance": 9,
    "zoomMin": 0.6,
    "zoomMax": 1.5
}

var stageTuning = [stageOne, stageTwo, stageThree, stageFour];
var stageNow = 0;