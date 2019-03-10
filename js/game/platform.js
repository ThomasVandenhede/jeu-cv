var Platform = (function() {
  var MAX_SPEED = 100;

  function Platform(props) {
    AABB.call(this, props);

    this.v = new Vector();
    this.solid = props && props.solid !== undefined ? props.solid : true; // can collide with other solid objects
    this.passthrough =
      props && props.passthrough !== undefined ? props.passthrough : false; // can it be traversed upwards
    this.touched = false; // is the player touching the platform
    this.color = "#5e4c4c";
  }

  Platform.prototype = Object.create(AABB.prototype);
  Platform.prototype.constructor = Platform;

  Platform.prototype.update = function() {};

  Platform.prototype.draw = function(ctx, camera) {
    var lineWidth = 3;
    ctx.save();
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    if (this.touched || !this.passthrough) {
      ctx.strokeStyle = "#db0000";
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(
        camera.applyToX(this.x + lineWidth / 2),
        camera.applyToY(this.y + lineWidth / 2),
        camera.applyToDistance(this.width - lineWidth),
        camera.applyToDistance(this.height - lineWidth)
      );
      ctx.fill();
      ctx.stroke();
    } else {
      lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = camera.applyToDistance(lineWidth);
      ctx.beginPath();
      ctx.strokeRect(
        camera.applyToX(this.x + lineWidth / 2),
        camera.applyToY(this.y + lineWidth / 2),
        camera.applyToDistance(this.width - lineWidth),
        camera.applyToDistance(this.height - lineWidth)
      );
    }
    ctx.restore();
  };

  return Platform;
})();
