var Particle = (function() {
  function Particle(x, y, size, color, vx, vy, maxLife) {
    Vector.call(this, x, y);

    this.size = size;
    this.color = color;

    this.v = new Vector(vx, vy);
    this.createdAt = Date.now();
    this.maxLife = maxLife;
  }

  Particle.prototype = Object.create(Vector.prototype);

  Particle.prototype.update = function() {
    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  };

  Particle.prototype.draw = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    var color = this.color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc.apply(
      ctx,
      applyCamToArr(this.x, this.y).concat([
        this.size * camera.zoomLevel,
        0,
        Math.PI * 2
      ])
    );
    ctx.fill();
  };

  return Particle;
})();
