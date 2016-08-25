function drawCarUI (forCar) {
        var speedometerX = canvas.width - (UI_TILE_THICKNESS / 2) * TRACK_W;
        var speedometerY = 65;
        var carSpeedRange = stageTuning[stageNow].maxSpeed - CAR_MIN_SPEED;

        canvasContext.fillStyle = "black";
        //canvasContext.fillRect(canvas.width - UI_TILE_THICKNESS * TRACK_W, 0,
            //UI_TILE_THICKNESS * TRACK_W, canvas.height);

        forCar.needleWobbleOsc += Math.random() * 0.07;

        forCar.needleWobbleOsc2 -= Math.random() * 0.07;
        forCar.needleSpeed += Math.random() * 0.3 * (forCar.carSpeed / carSpeedRange) * Math.sin(forCar.needleWobbleOsc + forCar.needleWobbleOsc2);

        var kValue = 0.90;
        forCar.needleSpeed = kValue * forCar.needleSpeed + (1.0-kValue) * forCar.carSpeed;
        if (forCar.needleSpeed > stageTuning[stageNow].maxSpeed) {
            forCar.needleSpeed = stageTuning[stageNow].maxSpeed;
        }
        
        var carSpeedPerc = forCar.needleSpeed / carSpeedRange;
        var needleLength = TRACK_W * 0.75;
        var needleAng = carSpeedPerc * (Math.PI + (60 * (Math.PI/180))) + (Math.PI - (30 * (Math.PI/180)));
        var needleEndX = Math.cos(needleAng) * needleLength + speedometerX;
        var needleEndY = Math.sin(needleAng) * needleLength + speedometerY;

        var radsBetweenLines = 7.5 * (Math.PI/180);

        for (var r = Math.PI - (30 * (Math.PI/180)); r < Math.PI * 2 + (30 * (Math.PI/180)); r+=radsBetweenLines) {
            forCar.drawAngSeg(speedometerX, speedometerY, r, needleLength, needleLength * 1.1, "white", 1);
        }

        radsBetweenLines = 30 * (Math.PI/180);
        for (var r = Math.PI; r < Math.PI * 2 + .1; r+=radsBetweenLines) {
            forCar.drawAngSeg(speedometerX, speedometerY, r, needleLength * 0.9, needleLength * 1.2, "white", 2);
        }

        /*canvasContext.beginPath();
        canvasContext.moveTo(canvas.width - UI_TILE_THICKNESS * TRACK_W, 0);
        canvasContext.lineTo(canvas.width - UI_TILE_THICKNESS * TRACK_W, canvas.height);
        canvasContext.strokeStyle = stageTuning[stageNow].color;
        canvasContext.stroke();*/

        // Speedometer needle.
        colorLine(speedometerX, speedometerY, needleEndX, needleEndY, "red", 1);
        forCar.drawAngSeg(speedometerX, speedometerY, needleAng, needleLength * 0.75, needleLength, "gold", 1);

        // Speedometer needle origin circle.
        colorCircle(speedometerX, speedometerY, needleLength * 0.05, "white");

        // Speedometer half circle.
        canvasContext.beginPath();
        canvasContext.arc(speedometerX, speedometerY, needleLength * 1.20, 30 * (Math.PI/180), Math.PI - (30 * (Math.PI/180)), true);
        canvasContext.strokeStyle = "white";
        canvasContext.stroke();

        // Text center of UI
        var centerTextX = speedometerX + needleLength * 0.75;

        var whole = Math.floor(timeTenths / 10);
        var decimal = timeTenths - whole * 10;
        var displayTextString = whole + "." + decimal;

        if (attractLoop == false) {
            // Speed text
            var speedOutput = forCar.needleSpeed * 15.0;
            speedOutput = speedOutput.toFixed(1) + " mph";
            canvasContext.fillStyle = "white";
            canvasContext.textAlign = "right";
            canvasContext.font="8px Poiret One";
            canvasContext.fillText(speedOutput, centerTextX, speedometerY + 25);

            canvasContext.font="30px Poiret One";
            canvasContext.textAlign = "center";

            // Distance in miles.
            /*var distanceMiles = forCar.totalDistance * MILES_PER_PIXEL;

            if (stageNow < stageTuning.length - 1 && distanceMiles > stageTuning[stageNow + 1].startDistance) {
                stageNow ++;
            }

            canvasContext.fillText("Distance", centerTextX - 20, canvas.height / 2 - 35);
            canvasContext.textAlign = "left";
            canvasContext.fillText(distanceMiles.toFixed(1), centerTextX - 45, canvas.height / 2);*/

            // Timer
            var timeX = 50;
            var timeY = 55;

            canvasContext.textAlign = "center";
            canvasContext.fillText("Time", timeX, timeY);
            canvasContext.textAlign = "left";
            canvasContext.fillText(displayTextString, timeX - 25, timeY + 35);

            // Score
            var scoreX = canvas.width / 2;
            var scoreY = timeY;

            canvasContext.textAlign = "center";
            canvasContext.fillText("Score/Goal", scoreX, scoreY);
            //canvasContext.textAlign = "left";
            canvasContext.fillText(currentScore + "/" + currentScoreGoal, scoreX, scoreY + 35);

            // Score goal
            /*canvasContext.textAlign = "center";
            canvasContext.fillText("Score goal", centerTextX - 20, canvas.height * 5 / 6 - 35);
            canvasContext.textAlign = "left";
            canvasContext.fillText(currentScoreGoal, centerTextX - 45, canvas.height * 5 / 6);*/
        }
        else {
            canvasContext.font="50px Poiret One";
            canvasContext.textAlign = "center";
            canvasContext.fillText("Interstate Drifter", (canvas.width - UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2);
            canvasContext.font="25px Poiret One";
            canvasContext.fillText("By Paul Diaz", (canvas.width - UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2 + 40);

            if (timeTenths > 0 ){
                canvasContext.fillText("Game over. Your time was " + displayTextString, (canvas.width - UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2 + 100);
            }
            else {
                canvasContext.fillText("Near miss to get points!", (canvas.width - UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2 + 100);
            }
            canvasContext.fillText("SPACEBAR", canvas.width - (UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2 + 10);
            canvasContext.fillText("to start!", canvas.width - (UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2 + 35);

        }
    }