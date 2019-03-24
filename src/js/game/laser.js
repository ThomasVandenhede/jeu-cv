var Laser = (function() {
  function Laser(props) {
    this.length = 20;
    var A = new SDK.Vector(props.x, props.y);
    var B = SDK.Vector.sum(A, props.direction.scale(this.length));
    SDK.Segment.call(this, A, B);

    this.origin = new SDK.Vector(props.x, props.y);
    this.speed = 250;
    this.v = SDK.Vector.subtract(B, A)
      .getUnitVector()
      .scale(this.speed);

    // stats
    this.damage = props.damage;

    // timings
    this.createdAt = Date.now();
    this.range = props.range;

    this.color = props.color;
  }

  Laser.prototype = Object.create(SDK.Segment.prototype);
  Laser.prototype.constructor = Laser;

  Laser.prototype.hasReachedMaxRange = function() {
    return (
      SDK.Vector.subtract(this.B, this.origin).normSquared >=
      Math.pow(this.range, 2)
    );
  };

  Laser.prototype.update = function() {
    var dPos = this.v.scale(dt);
    this.A = SDK.Vector.sum(this.A, dPos);
    this.B = SDK.Vector.sum(this.B, dPos);
  };

  Laser.prototype.draw = function(ctx, camera) {
    var lineWidth = 3;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(this.A.x), camera.applyToY(this.A.y));
    ctx.lineTo(camera.applyToX(this.B.x), camera.applyToY(this.B.y));
    ctx.stroke();
    ctx.restore();
  };

  return Laser;
})();

module.exports = Laser;
