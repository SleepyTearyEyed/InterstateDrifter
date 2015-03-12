function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath(); // Tells browser that this is a new, separate shape.
    // x, y (from center), radius, start, and end angles. True means draw counterclockwise.
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); 
    canvasContext.fill(); // color in shape formed since beginPath().
}

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY, withAngle) {

    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAngle);
    canvasContext.drawImage(graphic, -carPic.width / 2, -carPic.height / 2);
    canvasContext.restore();

}