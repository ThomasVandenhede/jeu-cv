var MovingPlatform = (function() {
  function MovingPlatform(xStart, yStart, width, height, xEnd, yEnd, speed) {
    Platform.call(this, { x: xStart, y: yStart, width: width, height: height });

    this.xStart = xStart !== undefined ? xStart : 0;
    this.yStart = yStart !== undefined ? yStart : 0;
    this.xEnd = xEnd !== undefined ? xEnd : xStart;
    this.yEnd = yEnd !== undefined ? yEnd : yStart;

    this.speed = speed || 50;
    this.v = new Vector(this.xEnd - this.x, this.yEnd - this.y);
    var vNorm = this.v.norm;
    this.v = this.v.multiplyByScalar(this.speed / vNorm);

    this.color = "rgb(0, 100, 255)";
    this.color = "darkorange";
  }

  MovingPlatform.prototype = Object.create(Platform.prototype);
  MovingPlatform.prototype.constructor = MovingPlatform;

  MovingPlatform.prototype.updateVelocity = function() {
    // // horizontal velocity
    // if (
    //   this.v.x > 0 &&
    //   ((this.xEnd - this.xStart) * (this.xEnd - this.x) < 0 ||
    //     (this.xEnd - this.xStart) * (this.x - this.xStart) < 0)
    // ) {
    //   this.v.x = -Math.abs(this.v.x);
    // } else if (
    //   this.v.x < 0 &&
    //   ((this.xEnd - this.xStart) * (this.xEnd - this.x) < 0 ||
    //     (this.xEnd - this.xStart) * (this.x - this.xStart) < 0)
    // ) {
    //   this.v.x = Math.abs(this.v.x);
    // }
    // // vertical velocity
    // if (
    //   this.v.y > 0 &&
    //   ((this.yEnd - this.yStart) * (this.yEnd - this.y) < 0 ||
    //     (this.yEnd - this.yStart) * (this.y - this.yStart) < 0)
    // ) {
    //   this.v.y = -Math.abs(this.v.y);
    // } else if (
    //   this.v.y < 0 &&
    //   ((this.yEnd - this.yStart) * (this.yEnd - this.y) < 0 ||
    //     (this.yEnd - this.yStart) * (this.y - this.yStart) < 0)
    // ) {
    //   this.v.y = Math.abs(this.v.y);
    // }
  };

  MovingPlatform.prototype.update = function() {
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;
    if (this.x + dx > this.xEnd || this.y + dy > this.yEnd) {
      this.v.x = -Math.abs(this.v.x);
      this.v.y = -Math.abs(this.v.y);
    }
    if (this.x + dx < this.xStart || this.y + dy < this.yStart) {
      this.v.x = Math.abs(this.v.x);
      this.v.y = Math.abs(this.v.y);
    }

    this.x = toFixedPrecision(this.x + dx, 2);
    this.y = toFixedPrecision(this.y + dy, 2);
  };

  return MovingPlatform;
})();
