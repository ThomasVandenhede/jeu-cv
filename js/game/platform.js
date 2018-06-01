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
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    ctx.save();
    if (this.touched) {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect.apply(
        ctx,
        applyCamToArr(this.x, this.y).concat([
          this.width * camera.zoomLevel,
          this.height * camera.zoomLevel
        ])
      );
      ctx.stroke();
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(this.x, this.y).concat([
          this.width * camera.zoomLevel,
          this.height * camera.zoomLevel
        ])
      );
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.strokeRect.apply(
        ctx,
        applyCamToArr(this.x, this.y).concat([
          this.width * camera.zoomLevel,
          this.height * camera.zoomLevel
        ])
      );
    }
    ctx.restore();
  };

  return Platform;
})();
