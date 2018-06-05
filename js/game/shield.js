var Shield = (function() {
  var MIN_SIZE = 0;
  var MAX_SIZE = 40;

  function Shield(shielded) {
    this.shielded = shielded || null; // object benefitting from the shield
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
    return new AABB(
      shielded.left - this.r,
      shielded.top - this.r,
      shielded.width + this.r * 2,
      shielded.height + this.r * 2
    );
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
      dr = (MAX_SIZE - MIN_SIZE) / this.openingDuration * dt;
      // shield opening
      if (this.r + dr < MAX_SIZE) {
        this.r += dr;
      } else {
        this.r = MAX_SIZE;
        this.isAnimating = false;
      }
    } else {
      dr = (MAX_SIZE - MIN_SIZE) / this.closingDuration * dt;
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
    c1 = new Circle(shielded.left, shielded.top, r);
    c2 = new Circle(shielded.right, shielded.top, r);
    c3 = new Circle(shielded.right, shielded.bottom, r);
    c4 = new Circle(shielded.left, shielded.bottom, r);
    r1 = new AABB(
      shielded.left - r,
      shielded.top,
      shielded.width + 2 * r,
      shielded.height
    );
    r2 = new AABB(
      shielded.left,
      shielded.top - r,
      shielded.width,
      shielded.height + 2 * r
    );

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
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var r = this.r;
    var left = this.shielded.x - this.r;
    var top = this.shielded.y - this.r;
    var right = left + 2 * this.r + this.shielded.width;
    var bottom = top + 2 * this.r + this.shielded.height;
    var lineWidth = 2;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.strokeStyle = this.shielded.color;
    ctx.lineWidth = lineWidth * camera.zoomLevel;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, applyCamToArr(left, top + r));
    ctx.arcTo.apply(
      ctx,
      applyCamToArr(left, top)
        .concat(applyCamToArr(left + r, top))
        .concat([r * camera.zoomLevel])
    );
    ctx.lineTo.apply(ctx, applyCamToArr(right - r, top));
    ctx.arcTo.apply(
      ctx,
      applyCamToArr(right, top)
        .concat(applyCamToArr(right, top + r))
        .concat([r * camera.zoomLevel])
    );
    ctx.lineTo.apply(ctx, applyCamToArr(right, bottom - r));
    ctx.arcTo.apply(
      ctx,
      applyCamToArr(right, bottom)
        .concat(applyCamToArr(right - r, bottom))
        .concat([r * camera.zoomLevel])
    );
    ctx.lineTo.apply(ctx, applyCamToArr(left + r, bottom));
    ctx.arcTo.apply(
      ctx,
      applyCamToArr(left, bottom)
        .concat(applyCamToArr(left, bottom - r))
        .concat([r * camera.zoomLevel])
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  return Shield;
})();
