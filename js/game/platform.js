var Platform = (function() {
  var MAX_SPEED = 100;

  function Platform(x, y, width, height) {
    AABB.call(this, x, y, width, height);

    this.v = new Vector();
    this.touched = false; // is the player touching the platform
    this.color = "#ddd";
  }

  Platform.prototype = Object.create(AABB.prototype);

  Platform.prototype.getNextState = function() {
    return this;
  };

  Platform.prototype.update = function() {};

  Platform.prototype.draw = function(ctx, camera) {
    ctx.save();
    if (this.touched) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.x - camera.x, this.y - camera.y, this.width, this.height);
      ctx.fill();

      // inset shadow
      ctx.shadowBlur = 3;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(this.x - camera.x, this.y - camera.y, this.width, this.height);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      );
    }
    ctx.restore();
  };

  return Platform;
})();
