var SmokeParticle = (function() {
  function SmokeParticle(props) {
    Particle.call(this, props);

    this.image = new Image();
    this.image.src = "./assets/images/smoke2.png";
  }

  SmokeParticle.prototype = Object.create(Particle.prototype);
  SmokeParticle.prototype.constructor = SmokeParticle;

  SmokeParticle.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.drawImage(
      this.image,
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.size),
      camera.applyToDistance(this.size)
    );
    ctx.restore();
  };
  return SmokeParticle;
})();
