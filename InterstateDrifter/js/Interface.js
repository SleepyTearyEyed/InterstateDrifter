function drawCarUI (forCar) {
        var speedometerX = canvas.width - (UI_TILE_THICKNESS / 2) * TRACK_W;
        var speedometerY = canvas.height - TRACK_H;
        var carSpeedRange = CAR_MAX_SPEED - CAR_MIN_SPEED;

        canvasContext.fillStyle = "black";
        canvasContext.fillRect(canvas.width - UI_TILE_THICKNESS * TRACK_W, 0,
            UI_TILE_THICKNESS * TRACK_W, canvas.height);

        forCar.needleWobbleOsc += Math.random() * 0.07;

        forCar.needleWobbleOsc2 -= Math.random() * 0.07;
        forCar.needleSpeed += Math.random() * 0.3 * (forCar.carSpeed / carSpeedRange) * Math.sin(forCar.needleWobbleOsc + forCar.needleWobbleOsc2);

        var kValue = 0.90;
        forCar.needleSpeed = kValue * forCar.needleSpeed + (1.0-kValue) * forCar.carSpeed;
        if (forCar.needleSpeed > CAR_MAX_SPEED) {
            forCar.needleSpeed = CAR_MAX_SPEED;
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

        canvasContext.beginPath();
        canvasContext.moveTo(canvas.width - UI_TILE_THICKNESS * TRACK_W, 0);
        canvasContext.lineTo(canvas.width - UI_TILE_THICKNESS * TRACK_W, canvas.height);
        canvasContext.stroke();

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

        if (attractLoop == false) {
            // Speed text
            var speedOutput = forCar.needleSpeed * 15.0;
            speedOutput = speedOutput.toFixed(1) + " mph";
            canvasContext.fillStyle = "white";
            canvasContext.textAlign = "right";
            canvasContext.font="8px Poiret One";
            canvasContext.fillText(speedOutput, centerTextX, speedometerY + 25);

            // Distance in miles.
            var distanceMiles = forCar.totalDistance * MILES_PER_PIXEL;
            canvasContext.font="30px Poiret One";
            canvasContext.textAlign = "center";
            canvasContext.fillText("Distance", centerTextX, canvas.height / 2 - 35);
            canvasContext.textAlign = "left";
            canvasContext.fillText(distanceMiles.toFixed(1), centerTextX - 30, canvas.height / 2);

            // Timer
            var whole = Math.floor(timeTenths / 10);
            var decimal = timeTenths - whole * 10;
            canvasContext.textAlign = "center";
            canvasContext.fillText("Timer", centerTextX, canvas.height / 4 - 35)
            canvasContext.textAlign = "left";
            canvasContext.fillText(whole + "." + decimal, centerTextX - 25, canvas.height / 4);
        }
        else {
            canvasContext.font="50px Poiret One";
            canvasContext.textAlign = "center";
            canvasContext.fillText("Title", canvas.width - (UI_TILE_THICKNESS * TRACK_W) / 2, canvas.height / 2);
        }
    }