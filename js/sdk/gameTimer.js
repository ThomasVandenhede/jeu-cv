class GameTimer extends AABB {
  constructor(props) {
    super(props);
    this.isPaused = false;
    this.isCountDown = true;
  }

  getEllapsedTime() {
    return this.currentTime - this.previousTime;
  }

  pause() {
    this.isPaused = true;
  }

  play() {
    this.isPaused = false;
    this.currentTime = Date.now();
  }

  update() {
    if (!this.isPaused) {
      this.previousTime = this.currentTime;
      this.currentTime = Date.now();
      this.totalTime += this.currentTime - this.previousTime;
    }
  }

  reset(timestamp) {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.countdownStart = timestamp || 0.5 * 60 * 1000; // ms;
  }

  draw(ctx) {
    var displayTime = new Date();
    this.isCountDown
      ? displayTime.setTime(Math.max(0, this.countdownStart - this.totalTime))
      : displayTime.setTime(this.totalTime);
    var seconds = displayTime.getSeconds();
    var minutes = displayTime.getMinutes();

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
      this.isCountDown && this.countdownStart - this.totalTime < 16000
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
  }
}
