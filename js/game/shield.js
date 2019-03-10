var Shield = (function() {
  var MIN_SIZE = 0;
  var MAX_SIZE = 40;

  function Shield(props) {
    this.shielded = props.shielded || null; // object benefitting from the shield
    this.r = MIN_SIZE;
    this.isOpen = false;
    this.isAnimating = false;

    // timings
    this.openingDuration = 0.3;
    this.closingDuration = 0.6;

    // hit points
    this.hitPoints = 200;

    // sounds
    this.sounds = {
      open: new Sound("./assets/sounds/Open.mp3", 0.1),
      close: new Sound("./assets/sounds/Close.mp3", 0.2)
    };
  }

  Shield.prototype.getBoundingRect = function() {
    var shielded = this.shielded;
    return new AABB({
      x: shielded.left - this.r,
      y: shielded.top - this.r,
      width: shielded.width + this.r * 2,
      height: shielded.height + this.r * 2
    });
  };

  Shield.prototype.open = function() {
    this.sounds.close.stop();
    this.sounds.open.play();
    this.isOpen = true;
    this.isAnimating = true;
  };

  Shield.prototype.close = function() {
    this.sounds.open.stop();
    this.sounds.close.play();
    this.isOpen = false;
    this.isAnimating = true;
  };

  Shield.prototype.update = function() {
    var dr;
    if (this.isOpen) {
      dr = ((MAX_SIZE - MIN_SIZE) / this.openingDuration) * dt;
      // shield opening
      if (this.r + dr < MAX_SIZE) {
        this.r += dr;
      } else {
        this.r = MAX_SIZE;
        this.isAnimating = false;
      }
    } else {
      dr = ((MAX_SIZE - MIN_SIZE) / this.closingDuration) * dt;
      // shield closing
      if (this.r - dr > MIN_SIZE) {
        this.r -= dr;
      } else {
        this.r = MIN_SIZE;
        this.isAnimating = false;
      }
    }
  };

  Shield.prototype.hasCollisionWithLaser = function(laser) {
    var boundingRect = this.getBoundingRect();
    var collision = physics.collision;
    var shielded = this.shielded;
    var r = this.r;

    // return if the two shapes bounding rectangles don't collide
    if (!collision.AABBWithAABB(boundingRect, laser.getBoundingRect())) {
      return false;
    }

    // the shield can be decomposed in 6 shapes
    c1 = new Circle({ x: shielded.left, y: shielded.top, r: r });
    c2 = new Circle({ x: shielded.right, y: shielded.top, r: r });
    c3 = new Circle({ x: shielded.right, y: shielded.bottom, r: r });
    c4 = new Circle({ x: shielded.left, y: shielded.bottom, r: r });
    r1 = new AABB({
      x: shielded.left - r,
      y: shielded.top,
      width: shielded.width + 2 * r,
      height: shielded.height
    });
    r2 = new AABB({
      x: shielded.left,
      y: shielded.top - r,
      width: shielded.width,
      height: shielded.height + 2 * r
    });

    return (
      c1.containsPoint(laser.A) ||
      c1.containsPoint(laser.B) ||
      c2.containsPoint(laser.A) ||
      c2.containsPoint(laser.B) ||
      c3.containsPoint(laser.A) ||
      c3.containsPoint(laser.B) ||
      c4.containsPoint(laser.A) ||
      c4.containsPoint(laser.B) ||
      r1.contains(laser.A.x, laser.A.y) ||
      r1.contains(laser.B.x, laser.B.y) ||
      r2.contains(laser.A.x, laser.A.y) ||
      r2.contains(laser.B.x, laser.B.y)
    );
  };

  Shield.prototype.draw = function(ctx, camera) {
    var left = this.shielded.x - this.r;
    var top = this.shielded.y - this.r;
    var right = left + 2 * this.r + this.shielded.width;
    var bottom = top + 2 * this.r + this.shielded.height;
    var lineWidth = 2;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.strokeStyle = this.shielded.color;
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(left), camera.applyToY(top + this.r));
    ctx.arcTo(
      camera.applyToX(left),
      camera.applyToY(top),
      camera.applyToX(left + this.r),
      camera.applyToY(top),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(right - this.r), camera.applyToY(top));
    ctx.arcTo(
      camera.applyToX(right),
      camera.applyToY(top),
      camera.applyToX(right),
      camera.applyToY(top + this.r),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(right), camera.applyToY(bottom - this.r));
    ctx.arcTo(
      camera.applyToX(right),
      camera.applyToY(bottom),
      camera.applyToX(right - this.r),
      camera.applyToY(bottom),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(left + this.r), camera.applyToY(bottom));
    ctx.arcTo(
      camera.applyToX(left),
      camera.applyToY(bottom),
      camera.applyToX(left),
      camera.applyToY(bottom - this.r),
      camera.applyToDistance(this.r)
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  return Shield;
})();
