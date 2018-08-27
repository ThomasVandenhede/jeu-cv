var MIN_SIZE = 0;
var MAX_SIZE = 40;

class Shield {
  constructor(props) {
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

  getBoundingRect() {
    var shielded = this.shielded;
    return new AABB({
      x: shielded.left - this.r,
      y: shielded.top - this.r,
      width: shielded.width + this.r * 2,
      height: shielded.height + this.r * 2
    });
  }

  open() {
    this.sounds.close.stop();
    this.sounds.open.play();
    this.isOpen = true;
    this.isAnimating = true;
  }

  close() {
    this.sounds.open.stop();
    this.sounds.close.play();
    this.isOpen = false;
    this.isAnimating = true;
  }

  update() {
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
  }

  hasCollisionWithLaser(laser) {
    var boundingRect = this.getBoundingRect();
    var collision = physics.collision;
    var shielded = this.shielded;
    var r = this.r;

    // return if the two shapes bounding rectangles don't collide
    if (!collision.AABBWithAABB(boundingRect, laser.getBoundingRect())) {
      return false;
    }

    // the shield can be decomposed in 6 shapes
    var c1 = new Circle({ x: shielded.left, y: shielded.top, r: r });
    var c2 = new Circle({ x: shielded.right, y: shielded.top, r: r });
    var c3 = new Circle({ x: shielded.right, y: shielded.bottom, r: r });
    var c4 = new Circle({ x: shielded.left, y: shielded.bottom, r: r });
    var r1 = new AABB({
      x: shielded.left - r,
      y: shielded.top,
      width: shielded.width + 2 * r,
      height: shielded.height
    });
    var r2 = new AABB({
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
  }

  draw(ctx, camera) {
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
  }
}
