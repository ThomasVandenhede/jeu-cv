var Camera = (function() {
  var AXIS = {
    NONE: "none",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    BOTH: "both"
  };

  function Camera(x, y, worldWidth, worldHeight) {
    this.x = x || 0;
    this.y = y || 0;

    this.xDeadZone = canvas.width / 3; // min distance to horizontal borders
    this.yDeadZone = canvas.height / 3; // min distance to vertical borders

    this.wView = canvas.width;
    this.hView = canvas.height;

    this.axis = AXIS.BOTH;

    this.followed = null;

    this.viewportRect = new Rectangle(this.x, this.y, this.wView, this.hView);

    // rectangle that represents the world's boundary (room's boundary)
    this.worldRect = new Rectangle(0, -500, 3000, 3000);
  }

  Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    // this.xDeadZone = xDeadZone;
    // this.yDeadZone = yDeadZone;
  };

  Camera.prototype.update = function() {
    // keep following the player (or other desired object)
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if (this.followed.x - this.x + this.xDeadZone > this.wView) {
          this.x = this.followed.x - (this.wView - this.xDeadZone);
        } else if (this.followed.x - this.xDeadZone < this.x) {
          this.x = this.followed.x - this.xDeadZone;
        }
      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if (this.followed.y - this.y + this.yDeadZone > this.hView) {
          this.y = this.followed.y - (this.hView - this.yDeadZone);
        } else if (this.followed.y - this.yDeadZone < this.y) {
          this.y = this.followed.y - this.yDeadZone;
        }
      }
    }

    // update viewportRect
    this.viewportRect.set(this.x, this.y);

    // don't let camera leave the world's boundaries
    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.left < this.worldRect.left) {
        this.x = this.worldRect.left;
      }
      if (this.viewportRect.top < this.worldRect.top) {
        this.y = this.worldRect.top;
      }
      if (this.viewportRect.right > this.worldRect.right) {
        this.x = this.worldRect.right - this.wView;
      }
      if (this.viewportRect.bottom > this.worldRect.bottom) {
        this.y = this.worldRect.bottom - this.hView;
      }
    }
  };

  return Camera;
})();
