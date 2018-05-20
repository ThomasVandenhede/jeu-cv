var Particle = (function () {
  function Particle(x, y, size, color, vx, vy) {
    Vector.call(this, x, y);

    this.size = size;
    this.color = color;

    this.v = new Vector(vx, vy);
    this.a = new Vector();
  }

  Particle.prototype = Object.create(Vector.prototype);

  Particle.prototype.update = function () {
    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  return Particle;
})();
