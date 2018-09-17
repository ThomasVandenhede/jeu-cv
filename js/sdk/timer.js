class Timer {
  constructor() {
    this.isPaused = false;
    this.currentTime = Date.now();
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
}
