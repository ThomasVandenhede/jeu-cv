var MovingPlatform = (function() {
  function MovingPlatform(xStart, yStart, width, height, xEnd, yEnd, speed) {
    Platform.call(this, xStart, yStart, width, height);

    this.xStart = xStart;
    this.yStart = yStart;
    this.xEnd = xEnd;
    this.yEnd = yEnd;

    this.speed = speed || 50;
    this.v = new Vector(this.xEnd - this.x, this.yEnd - this.y);
    var vNorm = this.v.norm;
    this.v = this.v.multiplyByScalar(this.speed / vNorm);

    this.color = "rgb(0, 199, 255)";
  }

  MovingPlatform.prototype = Object.create(Platform.prototype);

  MovingPlatform.prototype.update = function(dt) {
    if (this.x > this.xEnd || this.y > this.yEnd) {
      console.log("switch direction");
      this.x = this.xEnd;
      this.y = this.yEnd;
      this.v.x *= -1;
      this.v.y *= -1;
    }
    if (this.x < this.xStart || this.y < this.yStart) {
      this.x = this.xStart;
      this.y = this.yStart;
      this.v.x *= -1;
      this.v.y *= -1;
    }

    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  };

  return MovingPlatform;
})();
