var SmokeParticle = (function() {
  function SmokeParticle(props) {
    SDK.Particle.call(this, props);

    this.image = new Image();
    this.image.src = "./assets/images/smoke2.png";
  }

  SmokeParticle.prototype = Object.create(SDK.Particle.prototype);
  SmokeParticle.prototype.constructor = SmokeParticle;

  SmokeParticle.prototype.draw = function(ctx, camera) {
    ctx.globalAlpha = Math.max(
      0,
      1 - (Date.now() - this.createdAt) / this.maxLife
    );
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

module.exports = SmokeParticle;
