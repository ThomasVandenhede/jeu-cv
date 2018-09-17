class CrumblingPlatform extends Platform {
  constructor(props) {
    super(props);
    this.crumblingDelay = 2000; // crumbles 2s after being touched
    this.touchedTime;
  }

  startCountdown() {
    this.touchedTime = Date.now();
  }

  shouldCrumble() {
    return Date.now() - this.touchedTime >= this.crumblingDelay;
  }
}
