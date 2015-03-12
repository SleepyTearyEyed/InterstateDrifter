const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;


function initInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);

    p1.setupControls(KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

function setKeyHoldState(thisKey, thisCar, setTo) {
    if (thisKey == thisCar.controlKeyForTurnLeft) {
        thisCar.keyHeld_TurnLeft = setTo;
    }

    if (thisKey == thisCar.controlKeyForTurnRight) {
        thisCar.keyHeld_TurnRight = setTo;
    }
}

function keyPressed(evt) {
    setKeyHoldState(evt.keyCode, p1, true);

    document.getElementById("debugText").innerHTML = "KeyCode Pushed: " + evt.keyCode;

    evt.preventDefault();
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, p1, false);

    document.getElementById("debugText").innerHTML = "KeyCode Released: " + evt.keyCode;
}