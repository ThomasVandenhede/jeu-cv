var Laser = require("./laser");

var Ennemy = (function() {
  function Ennemy(x, y) {
    SDK.Circle.call(this, x, y, 10);

    this.v = new SDK.Vector();
    this.solid = false;
    this.damage = 5; // damage the ennemy's attack inflicts
    this.fireDelay = 500; // number of ms between two ennemy attacks
    this.visionRange = 300;
    this.attackRange = 500;
    this.lasers = [];
    this.lastFiredAt = Number.NEGATIVE_INFINITY;
  }

  Ennemy.prototype = Object.create(SDK.Circle.prototype);
  Ennemy.prototype.constructor = Ennemy;

  Ennemy.prototype.attack = function(direction) {
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
  };

  Ennemy.prototype.update = function() {};

  Ennemy.prototype.updateVelocity = function() {};

  Ennemy.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.r),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  };

  return Ennemy;
})();

module.exports = Ennemy;
