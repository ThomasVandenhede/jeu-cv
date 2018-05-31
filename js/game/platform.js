var Platform = (function() {
  var MAX_SPEED = 100;

  function Platform(x, y, width, height) {
    AABB.call(this, x, y, width, height);

    this.v = new Vector();
    this.touched = false; // is the player touching the platform
    this.color = "#ddd";
  }

  Platform.prototype = Object.create(AABB.prototype);

  Platform.prototype.update = function() {};

  Platform.prototype.draw = function(ctx, camera) {
    ctx.save();
    if (this.touched) {
      // // inset shadow
      // ctx.shadowBlur = 3;
      // ctx.lineWidth = 1;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.x - camera.x, this.y - camera.y, this.width, this.height);
      ctx.stroke();

      // ctx.shadowColor = this.color;
      // ctx.shadowBlur = 20;
      ctx.fillRect(
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      );
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
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
