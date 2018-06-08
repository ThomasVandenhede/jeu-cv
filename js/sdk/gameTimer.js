var GameTimer = (function() {
  function GameTimer(props) {
    AABB.call(this, props);
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.isPaused = false;
    this.isCountDown = true;
    this.countDownStart = 0.5 * 60 * 1000; // ms
  }

  GameTimer.prototype = Object.create(AABB.prototype);
  GameTimer.prototype.constructor = GameTimer;

  GameTimer.prototype.getEllapsedTime = function() {
    return this.currentTime - this.previousTime;
  };

  GameTimer.prototype.pause = function() {
    this.isPaused = true;
  };

  GameTimer.prototype.play = function() {
    this.isPaused = false;
    this.currentTime = Date.now();
  };

  GameTimer.prototype.update = function() {
    if (!this.isPaused) {
      this.previousTime = this.currentTime;
      this.currentTime = Date.now();
      this.totalTime += this.currentTime - this.previousTime;
    }
  };

  GameTimer.prototype.draw = function(ctx) {
    var displayTime = new Date();
    this.isCountDown
      ? displayTime.setTime(Math.max(0, this.countDownStart - this.totalTime))
      : displayTime.setTime(this.totalTime);
    seconds = displayTime.getSeconds();
    minutes = displayTime.getMinutes();

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var left = this.left;
    var right = this.right;
    var top = this.top;
    var bottom = this.bottom;
    var width = this.width;
    var height = this.height;
    var center = this.center;
    var r = height / 2;
    var color =
      this.isCountDown && this.countDownStart - this.totalTime < 16000
        ? "red"
        : "white";

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.stroke();
    ctx.fill();

    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(minutes + ":" + seconds, center.x, bottom - 7);
    ctx.restore();
  };

  return GameTimer;
})();
