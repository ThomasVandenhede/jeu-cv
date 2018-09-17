var Ennemy = (function() {
  function Ennemy(props) {
    AABB.call(this, {
      x: props.x,
      y: props.y,
      width: props.width || 20,
      height: props.height || 20
    });

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
