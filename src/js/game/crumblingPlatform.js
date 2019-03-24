var CrumblingPlatform = (function() {
  function CrumblingPlatform(props) {
    Platform.call(this, props);
    this.crumblingDelay = 2000; // crumbles 2s after being touched
    this.touchedTime;
  }

  CrumblingPlatform.prototype.startCountdown = function() {
    this.touchedTime = Date.now();
  };

  CrumblingPlatform.prototype.shouldCrumble = function() {
    return Date.now() - this.touchedTime >= this.crumblingDelay;
  };

  return CrumblingPlatform;
})();

// module.exports = CrumblingPlatform;
