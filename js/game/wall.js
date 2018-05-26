var Wall = (function() {
  var MAX_SPEED = 100;

  function Wall(A, B) {
    Segment.call(this, A, B);

    this.color = "#ddd";
  }

  Wall.prototype = Object.create(Segment.prototype);

  Wall.prototype.overlaps = function() {
    return true;
  };

  Wall.prototype.draw = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, applyCamToArr(this.A.x, this.A.y));
    ctx.lineTo.apply(ctx, applyCamToArr(this.B.x, this.B.y));
    ctx.stroke();
    ctx.restore();
  };

  return Wall;
})();
