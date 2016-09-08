/**
 * Created by Paul on 8/24/2016.
 */
const POINT_POPPER_FRAME_LIFETIME = 100;

function PointPop(){

    this.x = 200;
    this.y = 200;
    this.scoreValue = -1;
    this.framesLeft = 100;
    this.readyToRemove = false;
    this.displayWord = "";

    this.init = function(scoreVal, positionX, positionY, displayWord){
        this.scoreValue = scoreVal;
        var scatterRange = 30;
        this.x = positionX + Math.random() * scatterRange - Math.random() - scatterRange;
        this.y = positionY + Math.random() * scatterRange - Math.random() - scatterRange;
        this.framesLeft = POINT_POPPER_FRAME_LIFETIME;
        this.displayWord = displayWord;
    }

    this.draw  = function() {
        canvasContext.fillStyle = stageTuning[stageNow].color;
        canvasContext.textAlign = "center";
        canvasContext.font="16px Poiret One";
        canvasContext.fillText(this.displayWord, this.x, this.y);
    }

    this.move = function() {
        this.framesLeft --;

        if (this.framesLeft < 0) {
            this.readyToRemove = true;
        }
    }
}