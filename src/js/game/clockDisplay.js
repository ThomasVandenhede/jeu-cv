function ClockDisplay(props) {
  SDK.Rectangle.call(this, props);
  this.DANGER_COUNTDOWN_TIME = 5000;
  this.game = props.game;
  this.timerEl = document.getElementById("gameclock");
}

ClockDisplay.prototype = Object.create(SDK.Rectangle.prototype);
ClockDisplay.prototype.constructor = ClockDisplay;

ClockDisplay.prototype.getText = function(values) {
  var days = values.days;
  var hours = values.hours;
  var minutes = values.minutes;
  var seconds = values.seconds;
  var milliseconds = values.milliseconds;
  var textArr = [];

  if (values.days > 0) {
    textArr.push(days.toString());
  }
  if (days > 0 || hours > 0) {
    textArr.push(hours.toString().padStart(2, "0"));
  }
  textArr.push(
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  );
  if (this.game.clock.hasMilliseconds) {
    textArr.push(
      milliseconds
        .toString()
        .padStart(3, "0")
        .substring(0, 2)
    );
  }

  return textArr.join(":");
};

// update html element instead of drawing to the canvas
ClockDisplay.prototype.draw = function() {
  var clock = this.game.clock;
  var values = clock.getValues();
  var text = this.getText(values);

  if (this.timerEl.textContent !== text) {
    if (clock.isCountDown && clock.timeRemaining < this.DANGER_COUNTDOWN_TIME) {
      this.timerEl.classList.add("danger");
    } else {
      this.timerEl.classList.contains("danger") &&
        this.timerEl.classList.remove("danger");
    }
    this.timerEl.innerHTML = text;
  }
};

module.exports = ClockDisplay;
