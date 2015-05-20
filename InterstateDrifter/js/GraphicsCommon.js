// This file contains utility functions for drawing graphics.

// Draws a rectangle with specified color.
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorLine(startX, startY, endX, endY, fillColor, width) {
    canvasContext.beginPath();
    canvasContext.moveTo(startX, startY);
    canvasContext.lineTo(endX,endY);
    canvasContext.strokeStyle = fillColor;
    canvasContext.lineWidth = width;
    canvasContext.stroke();
}

// Draws a circle with specified color using the .arc function. 
function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    // Tells browser that this is a new, separate shape.
    canvasContext.beginPath();
    // X, y (from center), radius, start, and end angles. True means draw counterclockwise.
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); // Math.PI * 2 = a complete circle. PI = 180 deg.
    canvasContext.fill(); // color in shape formed since beginPath().
}

// All the above is for vector graphics this function is used for drawing pixel graphics.
function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY, withAngle) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAngle);
    canvasContext.drawImage(graphic, -carPic.width / 2, -carPic.height / 2);
    canvasContext.restore();
}