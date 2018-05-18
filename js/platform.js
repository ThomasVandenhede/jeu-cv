// Factory pattern
var Platform = (function() {
  var MAX_SPEED = 100;

  function Platform(x, y, width, height) {
    Rectangle.call(this, x, y, width, height); // subclassing Rectangle class
    this.touched = false; // does the player touch the platform
    this.color = "#fff";
  }

  Platform.prototype = Object.create(Rectangle.prototype);

  Platform.prototype.update = function(dt) {
    // update
  };

  Platform.prototype.draw = function(ctx, camera) {
    var that = this;
    ctx.save();
    if (this.touched) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = this.color;
      ctx.rect(this.x - camera.x, this.y - camera.y, this.width, this.height);
      ctx.fill();
      ctx.fill();
      ctx.fill();
      ctx.shadowOffsetX = -1000000;
      ctx.shadowOffsetY = 0;

      ctx.globalCompositeOperation = "source-atop";
      ctx.beginPath();
      ctx.shadowBlur = 10;
      ctx.rect(
        this.x + 1000000 - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      );
      ctx.stroke();
      ctx.stroke();
      ctx.stroke();
    } else {
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
