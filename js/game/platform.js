var MAX_SPEED = 100;

class Platform extends AABB {
  constructor(props) {
    super(props);

    this.v = new Vector();
    this.solid = props && props.solid !== undefined ? props.solid : true; // can collide with other solid objects
    this.passthrough =
      props && props.passthrough !== undefined ? props.passthrough : false; // can it be traversed upwards
    this.touched = false; // is the player touching the platform
    this.color = "#5e4c4c";
  }

  update() {}

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var lineWidth = 3;
    ctx.save();
    ctx.lineWidth = camera.scale(lineWidth);
    if (this.touched || !this.passthrough) {
      ctx.strokeStyle = "#db0000";
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect.apply(
        ctx,
        applyCamToArr(this.x + lineWidth / 2, this.y + lineWidth / 2).concat([
          camera.scale(this.width - lineWidth),
          camera.scale(this.height - lineWidth)
        ])
      );
      ctx.fill();
      ctx.stroke();
    } else {
      lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = camera.scale(lineWidth);
      ctx.beginPath();
      ctx.strokeRect.apply(
        ctx,
        applyCamToArr(this.x + lineWidth / 2, this.y + lineWidth / 2).concat([
          camera.scale(this.width - lineWidth),
          camera.scale(this.height - lineWidth)
        ])
      );
    }
    ctx.restore();
  }
}
