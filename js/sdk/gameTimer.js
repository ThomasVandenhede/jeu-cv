var GameTimer = (function() {
  function GameTimer() {}

  GameTimer.prototype.getEllapsedTime = function() {
    return this.currentTime - this.previousTime;
  };

  GameTimer.prototype.update = function() {
    this.previousTime = this.currentTime;
    this.currentTime = Date.now();
    this.totalTime += this.currentTime - this.previousTime;
  };

  GameTimer.prototype.reset = function() {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
  };

  return GameTimer;
})();
