var Particle = (function() {
  function Particle(props) {
    Vector.call(this, props.x, props.y);

    this.size = props.size;
    this.color = props.color;

    this.v = new Vector(props.vx, props.vy);
    this.createdAt = Date.now();
    this.maxLife = props.maxLife;
  }

  Particle.prototype = Object.create(Vector.prototype);
  Particle.prototype.constructor = Particle;

  Particle.prototype.update = function() {
    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  };

  Particle.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillRect(
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.size),
      camera.applyToDistance(this.size)
    );
  };

  return Particle;
})();
