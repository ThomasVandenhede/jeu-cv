var Vector = require("./geometry/vector");

var Particle = (function() {
  function Particle(props) {
    Vector.call(this, props.x, props.y);

    this.circle = props.circle;
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

  Particle.prototype.destroy = function() {
    delete this.particles[this.id];
  };

  Particle.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.circle) {
      ctx.arc(
        camera.applyToX(this.x + this.size / 2),
        camera.applyToY(this.y + this.size / 2),
        camera.applyToDistance(this.size / 2),
        0,
        2 * Math.PI
      );
    } else {
      ctx.rect(
        camera.applyToX(this.x),
        camera.applyToY(this.y),
        camera.applyToDistance(this.size),
        camera.applyToDistance(this.size)
      );
    }
    ctx.fill();
  };

  return Particle;
})();

module.exports = Particle;
