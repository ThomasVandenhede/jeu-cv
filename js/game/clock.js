var Clock = (function() {
  function Clock(props) {
    // reference to game object
    AABB.call(this, props);
    this.DANGER_COUNTDOWN_TIME = 5000;
    this.isPaused = false;
    this.isCountDown = true;
    this.timerEl = document.getElementById("gameclock");
  }

  Clock.prototype = Object.create(AABB.prototype);
  Clock.prototype.constructor = Clock;

  Clock.prototype.pause = function() {
    this.isPaused = true;
  };

  Clock.prototype.play = function() {
    this.isPaused = false;
    this.currentTime = Date.now();
  };

  Clock.prototype.update = function() {
    if (!this.isPaused) {
      this.previousTime = this.currentTime;
      this.currentTime = Date.now();
      this.totalTime += this.currentTime - this.previousTime;
    }
  };

  Clock.prototype.reset = function(timestamp) {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.countdownStart = timestamp || 0.5 * 60 * 1000; // ms;
  };

  Clock.prototype.getTimerText = function() {
    var displayTime = new Date();
    this.isCountDown
      ? displayTime.setTime(Math.max(0, this.countdownStart - this.totalTime))
      : displayTime.setTime(this.totalTime);
    var milliseconds = displayTime.getMilliseconds();
    var seconds = displayTime.getSeconds();
    var minutes = displayTime.getMinutes();

    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0") +
      ":" +
      milliseconds
        .toString()
        .padStart(3, "0")
        .substring(0, 2)
    );
  };

  // update html element instead of drawing to the canvas
  Clock.prototype.draw = function() {
    var timerText = this.getTimerText();

    if (this.timerEl.textContent !== timerText) {
      if (
        this.isCountDown &&
        this.countdownStart - this.totalTime < this.DANGER_COUNTDOWN_TIME
      ) {
        this.timerEl.classList.add("danger");
      } else {
        this.timerEl.classList.contains("danger") &&
          this.timerEl.classList.remove("danger");
      }
      this.timerEl.innerHTML = timerText;
    }
  };

  return Clock;
})();