class Particle extends Vector {
  constructor(props) {
    super(props.x, props.y);

    this.size = props.size;
    this.color = props.color;

    this.v = new Vector(props.vx, props.vy);
    this.createdAt = Date.now();
    this.maxLife = props.maxLife;
    // this.hasTransparency =
    //   hasTransparency !== undefined ? hasTransparency : false;
  }

  update() {
    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  }

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var color = this.color;
    var size = this.size;
    // var alpha = this.hasTransparency
    //   ? Math.max(0, 1 - (Date.now() - this.createdAt) / this.maxLife)
    //   : 1;
    // ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect.apply(
      ctx,
      applyCamToArr(this.x, this.y).concat([
        size * camera.zoomLevel,
        size * camera.zoomLevel
      ])
    );
  }
}
