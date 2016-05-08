const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_FORWARD_ARROW = 38;
const KEY_MINUS = 189;
const KEY_PLUS = 187;
const KEY_SPACE = 32;
const KEY_ONE  = 49;
const KEY_TWO  = 50;
const KEY_THREE  = 51;
const KEY_FOUR  = 52;


    function initInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);

    p1.setupControls(KEY_LEFT_ARROW, KEY_RIGHT_ARROW, KEY_FORWARD_ARROW, KEY_DOWN_ARROW);
}

function setKeyHoldState(thisKey, thisCar, setTo) {
    if (thisKey == thisCar.controlKeyForTurnLeft) {
        thisCar.keyHeld_TurnLeft = setTo;
    }

    if (thisKey == thisCar.controlKeyForTurnRight) {
        thisCar.keyHeld_TurnRight = setTo;
    }

    if (thisKey == thisCar.controlKeyForGas) {
        thisCar.keyHeld_Gas = setTo;
    }

    if (thisKey == thisCar.controlKeyForBrake) {
        thisCar.keyHeld_Brake = setTo;
    }
}

function keyPressed(evt) {
    if (attractLoop) {
        if (evt.keyCode == KEY_SPACE) {
            attractLoop = false;
            reset();
        }
        return
    }

    if (evt.keyCode == KEY_ONE) {
        stageNow = 0;
    }

    if (evt.keyCode == KEY_TWO) {
        stageNow = 1;
    }

    if (evt.keyCode == KEY_THREE) {
        stageNow = 2;
    }

    if (evt.keyCode == KEY_FOUR) {
        stageNow = 3;
    }

    setKeyHoldState(evt.keyCode, p1, true);

    if (evt.keyCode == KEY_PLUS) {
        zoom += 0.1;

        if (zoom > ZOOM_MAX) {
            zoom = ZOOM_MAX;
        }

        console.log("Increased = " + zoom);
    }

    if (evt.keyCode == KEY_MINUS) {
        zoom -= 0.1;

        if (zoom < ZOOM_MIN) {
            zoom = ZOOM_MIN;
        }

        console.log("Decreased = " + zoom);
    }

    //document.getElementById("debugText").innerHTML = "KeyCode Pushed: " + evt.keyCode;
    //document.getElementById("debugText").innerHTML = "Speedometer: " + p1.carSpeed;

    evt.preventDefault();
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, p1, false);

    //document.getElementById("debugText").innerHTML = "KeyCode Released: " + evt.keyCode;
    //document.getElementById("debugText").innerHTML = "Speedometer: " + p1.carSpeed;
}