var Laser = (function() {
  function Laser(props) {
    this.length = 20;
    var A = new Vector(props.x, props.y);
    var B = Vector.sum(A, props.direction.multiplyByScalar(this.length));
    Segment.call(this, A, B);

    this.origin = new Vector(props.x, props.y);
    this.speed = 250;
    this.v = Vector.subtract(B, A)
      .getUnitVector()
      .multiplyByScalar(this.speed);

    // stats
    this.damage = props.damage;

    // timings
    this.createdAt = Date.now();
    this.range = props.range;

    this.color = props.color;
  }

  Laser.prototype = Object.create(Segment.prototype);
  Laser.prototype.constructor = Laser;

  Laser.prototype.hasReachedMaxRange = function() {
    return (
      Vector.subtract(this.B, this.origin).normSquared >=
      Math.pow(this.range, 2)
    );
  };

  Laser.prototype.update = function() {
    var dPos = this.v.multiplyByScalar(dt);
    this.A = Vector.sum(this.A, dPos);
    this.B = Vector.sum(this.B, dPos);
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
