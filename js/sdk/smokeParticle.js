class SmokeParticle extends Particle {
  constructor(props) {
    super(props);

    this.image = new Image();
    this.image.src = "./assets/images/smoke2.png";
  }

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    ctx.save();
    ctx.drawImage.apply(
      ctx,
      [this.image]
        .concat(applyCamToArr(this.x, this.y))
        .concat([camera.scale(this.size), camera.scale(this.size)])
    );
    ctx.restore();
  }
}
