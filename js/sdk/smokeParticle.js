var SmokeParticle = (function() {
  function SmokeParticle(props) {
    Particle.call(this, props);

    this.image = new Image();
    this.image.src = "./assets/images/smoke2.png";
  }

  SmokeParticle.prototype = Object.create(Particle.prototype);
  SmokeParticle.prototype.constructor = SmokeParticle;

  SmokeParticle.prototype.draw = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    ctx.save();
    ctx.drawImage.apply(
      ctx,
      [this.image]
        .concat(applyCamToArr(this.x, this.y))
        .concat([this.size * camera.zoomLevel, this.size * camera.zoomLevel])
    );
    ctx.restore();
  };
  return SmokeParticle;
})();
