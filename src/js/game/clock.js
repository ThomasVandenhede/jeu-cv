var SECONDS_IN_ONE_MINUTE = 60;
var MINUTES_IN_ONE_HOUR = 60;
var HOURS_IN_ONE_DAY = 24;
var ONE_SECOND_IN_MS = 1000;
var ONE_MINUTE_IN_MS = SECONDS_IN_ONE_MINUTE * ONE_SECOND_IN_MS;
var ONE_HOUR_IN_MS = MINUTES_IN_ONE_HOUR * ONE_MINUTE_IN_MS;
var ONE_DAY_IN_MS = HOURS_IN_ONE_DAY * ONE_HOUR_IN_MS;

function Clock() {
  this.isPaused = false;
  this.hasMilliseconds = false;
  this.isCountDown = true;
}

Object.defineProperties(Clock.prototype, {
  timeRemaining: {
    get: function() {
      return this.countdownDuration - this.timeEllapsed;
    }
  }
});

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
    this.timeEllapsed += this.currentTime - this.previousTime;
  }
};

Clock.prototype.reset = function(initialDuration) {
  var defaultDuration =
    0 * ONE_DAY_IN_MS +
    0 * ONE_HOUR_IN_MS +
    180 * ONE_MINUTE_IN_MS +
    2 * ONE_SECOND_IN_MS;

  this.timeEllapsed = 0;
  this.countdownDuration = initialDuration || defaultDuration; // ms;
};

Clock.prototype.getValues = function() {
  var displayTime = this.isCountDown
    ? new Date(Math.max(0, this.timeRemaining))
    : new Date(this.timeEllapsed);
  var ms = displayTime.getTime();
  var milliseconds, seconds, minutes, hours, days;
  var round, values;

  if (this.isCountDown && !this.hasMilliseconds) {
    round = Math.ceil;
  } else {
    round = Math.floor;
  }

  milliseconds = ms % ONE_SECOND_IN_MS;
  seconds = round(ms / ONE_SECOND_IN_MS) % SECONDS_IN_ONE_MINUTE;
  minutes =
    round((ms - seconds * ONE_SECOND_IN_MS) / ONE_MINUTE_IN_MS) %
    MINUTES_IN_ONE_HOUR;
  hours =
    round(
      (ms - minutes * ONE_MINUTE_IN_MS - seconds * ONE_SECOND_IN_MS) /
        ONE_HOUR_IN_MS
    ) % HOURS_IN_ONE_DAY;
  days = round(
    (ms -
      hours * ONE_HOUR_IN_MS -
      minutes * ONE_MINUTE_IN_MS -
      seconds * ONE_SECOND_IN_MS) /
      ONE_DAY_IN_MS
  );

  values = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
  if (this.hasMilliseconds) {
    values.milliseconds = milliseconds;
  }

  return values;
};

module.exports = Clock;
