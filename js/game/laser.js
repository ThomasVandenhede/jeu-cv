const length = 20;

class Laser extends Segment {
  constructor(props) {
    var A = new Vector(props.x, props.y);
    var B = Vector.sum(A, props.direction.multiplyByScalar(length));
    super(A, B);
    this.length = length;

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

  hasReachedMaxRange() {
    return (
      Vector.subtract(this.B, this.origin).normSquared >=
      Math.pow(this.range, 2)
    );
  }

  update() {
    var dPos = this.v.multiplyByScalar(dt);
    this.A = Vector.sum(this.A, dPos);
    this.B = Vector.sum(this.B, dPos);
  }

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var A = this.A;
    var B = this.B;
    var lineWidth = 3;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = lineWidth * camera.zoomLevel;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, applyCamToArr(A.x, A.y));
    ctx.lineTo.apply(ctx, applyCamToArr(B.x, B.y));
    ctx.stroke();
    ctx.restore();
  }
}
