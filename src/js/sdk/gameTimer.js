var GameTimer = (function() {
  function GameTimer() {}

  Object.defineProperties(GameTimer.prototype, {
    dt: {
      get: function() {
        return toFixedPrecision(
          (this.currentTime - this.previousTime) / 1000,
          4
        );
      }
    }
  });

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

module.exports = GameTimer;
