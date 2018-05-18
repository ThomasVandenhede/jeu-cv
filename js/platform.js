// Factory pattern
var platformFactory = (function() {
  var MAX_SPEED = 100;
  var COLOR = "#ccc";

  function Platform(x, y, width, height) {
    Rectangle.call(this, x, y, width, height); // subclassing Rectangle class
    this.touched = false; // does the player touch the platform
  }

  Platform.prototype = Object.create(Rectangle.prototype);

  Platform.prototype.update = function(dt) {
    // update
  };

  Platform.prototype.draw = function(ctx, camera) {
    ctx.save();
    if (this.touched) {
      ctx.shadowColor = COLOR;
      ctx.shadowBlur = 30;
      ctx.fillStyle = COLOR;
      ctx.fillRect(
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      );
    } else {
      ctx.strokeStyle = COLOR;
      ctx.strokeRect(
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      );
    }
    ctx.restore();
  };

  return function(x, y, width, height) {
    return new Platform(x, y, width, height);
  };
})();
