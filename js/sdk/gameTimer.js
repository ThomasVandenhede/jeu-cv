var GameTimer = (function() {
  function GameTimer(props) {
    AABB.call(this, props);
    this.isPaused = false;
    this.isCountDown = true;
    this.timerEl = document.getElementById("gametimer");
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

  GameTimer.prototype.reset = function(timestamp) {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.countdownStart = timestamp || 0.5 * 60 * 1000; // ms;
  };

  GameTimer.prototype.getTimerText = function() {
    var displayTime = new Date();
    this.isCountDown
      ? displayTime.setTime(Math.max(0, this.countdownStart - this.totalTime))
      : displayTime.setTime(this.totalTime);
    var seconds = displayTime.getSeconds();
    var minutes = displayTime.getMinutes();

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return minutes + ":" + seconds;
  };

  // update html element instead of drawing to the canvas
  GameTimer.prototype.draw = function() {
    var timerText = this.getTimerText();

    if (this.timerEl.textContent !== timerText) {
      if (this.isCountDown && this.countdownStart - this.totalTime < 16000) {
        this.timerEl.classList.add("danger");
      } else {
        this.timerEl.classList.contains("danger") &&
          this.timerEl.classList.remove("danger");
      }
      this.timerEl.innerHTML = timerText;
    }
  };

  return GameTimer;
})();
