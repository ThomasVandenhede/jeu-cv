var GameTimer = (function() {
  function GameTimer() {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.isPaused = false;
    this.isCountDown = false;
    this.countDownStart = 0.1 * 60 * 1000; // ms
  }

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

    ctx.save();
    ctx.fillStyle = "rgba(27, 229, 0)";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(minutes + ":" + seconds, canvas.width / 2, 80);
    ctx.restore();
  };

  return GameTimer;
})();
