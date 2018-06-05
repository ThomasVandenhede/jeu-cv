var Ennemy = (function() {
  function Ennemy(x, y) {
    AABB.call(this, x, y, 20, 20);

    this.v = new Vector();
    this.solid = false;
    this.damage = 5; // damage the ennemy's attack inflicts
    this.fireDelay = 500; // number of ms between two ennemy attacks
    this.visionRange = 300;
    this.attackRange = 500;
    this.lasers = [];
    this.lastFiredAt = Number.NEGATIVE_INFINITY;
  }

  Ennemy.prototype = Object.create(AABB.prototype);
  Ennemy.prototype.constructor = Ennemy;

  Ennemy.prototype.attack = function(direction) {
    var center = this.center;
    this.lastFiredAt = Date.now();
    return new Laser(
      center.x,
      center.y,
      direction,
      this.damage,
      this.attackRange,
      "red"
    );
  };

  Ennemy.prototype.update = function() {};

  Ennemy.prototype.updateVelocity = function() {};

  Ennemy.prototype.draw = function(ctx, camera) {
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
        r * camera.zoomLevel,
        0,
        Math.PI * 2
      ])
    );
    ctx.fill();
    ctx.restore();
  };

  return Ennemy;
})();
