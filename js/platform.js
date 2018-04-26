// Factory pattern
var platformFactory = (function() {
  var MAX_SPEED = 100;

  function Platform(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  Platform.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
  };

  return function(x, y, width, height) {
    return new Platform(x, y, width, height);
  };
})();
