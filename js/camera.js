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
  }

  Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
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

    // don't let camera leave the world's boundaries
    if (
      !new Rectangle(this.x, this.y, this.wView, this.hView).within(worldRect)
    ) {
      if (this.x < worldRect.left) {
        this.x = worldRect.left;
      }
      if (this.y < worldRect.top) {
        this.y = worldRect.top;
      }
      if (this.x + this.wView > worldRect.right) {
        this.x = worldRect.right - this.wView;
      }
      if (this.y + this.hView > worldRect.bottom) {
        this.y = worldRect.bottom - this.hView;
      }
    }

    // update viewportRect
    this.viewportRect.set(this.x, this.y);
  };

  return Camera;
})();
