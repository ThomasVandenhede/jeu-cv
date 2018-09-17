class Clock extends AABB {
  constructor(props) {
    super(props);
    this.timer = props.timer;
    this.isPaused = false;
    this.isCountDown = true;
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

    var color =
      this.isCountDown && this.countdownStart - this.totalTime < 16000
        ? "red"
        : "white";

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(this.left, this.top, this.width, this.height);
    ctx.stroke();
    ctx.fill();

    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(minutes + ":" + seconds, this.center.x, this.bottom - 7);
    ctx.restore();
  }
}
