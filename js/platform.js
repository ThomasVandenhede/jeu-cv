// Factory pattern
var platformFactory = (function() {
  var MAX_SPEED = 100;

  function Platform(x, y, width, height) {
    Rectangle.call(this, x, y, width, height); // subclassing Rectangle class
  }

  Platform.prototype = Object.create(Rectangle.prototype);

  Platform.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
  };

  Platform.prototype.update = Function.prototype;

  return function(x, y, width, height) {
    return new Platform(x, y, width, height);
  };
})();
