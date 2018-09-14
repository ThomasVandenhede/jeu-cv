class Ennemy extends AABB {
  constructor(props) {
    super({
      x: props.x,
      y: props.y,
      width: props.width || 20,
      height: props.height || 20
    });

    this.v = new Vector();
    this.solid = false;
    this.damage = 5; // damage the ennemy's attack inflicts
    this.fireDelay = 500; // number of ms between two ennemy attacks
    this.visionRange = 300;
    this.attackRange = 500;
    this.lasers = [];
    this.lastFiredAt = Number.NEGATIVE_INFINITY;
  }

  attack(direction) {
    var center = this.center;
    this.lastFiredAt = Date.now();
    return new Laser({
      x: center.x,
      y: center.y,
      direction: direction,
      damage: this.damage,
      range: this.attackRange,
      color: "lightgrey"
    });
  }

  update() {}

  updateVelocity() {}

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var center = this.center;
    var r = this.width / 2;
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc.apply(
      ctx,
      applyCamToArr(center.x, center.y).concat([
        camera.scale(r),
        0,
        Math.PI * 2
      ])
    );
    ctx.fill();
    ctx.restore();
  }
}
