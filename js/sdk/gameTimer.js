var GameTimer = (function() {
  function GameTimer() {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.isPaused = false;
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
    var totalTime = new Date();
    totalTime.setTime(this.totalTime);
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(totalTime.toISOString("mm:ss"), canvas.width / 2, 80);
  };

  return GameTimer;
})();
