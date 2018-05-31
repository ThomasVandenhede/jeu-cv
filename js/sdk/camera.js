var Camera = (function () {
  var AXIS = {
    NONE: "none",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    BOTH: "both"
  };

  function Camera(context, x, y, zoomLevel) {
    AABB.call(this, x, y, canvas.width, canvas.height);

    this.context = context;

    this.zoomLevel = zoomLevel || 1;
    this.height = canvas.height / this.zoomLevel;
    this.width = canvas.width / this.zoomLevel;

    this.x = x || 0;
    this.y = y || 0;

    this.xDeadZone = canvas.width / 3; // min distance to horizontal borders
    this.yDeadZone = canvas.height / 3; // min distance to vertical borders

    this.axis = AXIS.BOTH;

    this.followed = null;

    this.shouldStayWithinWorldBounds = false;
  }

  Camera.prototype = Object.create(AABB.prototype);

  Camera.prototype.follow = function (gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  };

  Camera.prototype.update = function () {
    this.height = canvas.height / this.zoomLevel;
    this.width = canvas.width / this.zoomLevel;

    // keep following the player (or other desired object)
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if (this.followed.x - this.x + this.xDeadZone > this.width) {
          this.x = this.followed.x - (this.width - this.xDeadZone);
        } else if (this.followed.x - this.xDeadZone < this.x) {
          this.x = this.followed.x - this.xDeadZone;
        }
      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if (this.followed.y - this.y + this.yDeadZone > this.height) {
          this.y = this.followed.y - (this.height - this.yDeadZone);
        } else if (this.followed.y - this.yDeadZone < this.y) {
          this.y = this.followed.y - this.yDeadZone;
        }
      }
    }

    // don't let camera leave the world's boundaries
    if (
      this.shouldStayWithinWorldBounds &&
      !new AABB(this.x, this.y, this.width, this.height).within(worldRect)
    ) {
      if (this.x < worldRect.left) {
        this.x = worldRect.left;
      }
      if (this.y < worldRect.top) {
        this.y = worldRect.top;
      }
      if (this.x + this.width > worldRect.right) {
        this.x = worldRect.right - this.width;
      }
      if (this.y + this.height > worldRect.bottom) {
        this.y = worldRect.bottom - this.height;
      }
    }
  };

  Camera.prototype.applyCamera = function (x, y) {
    var screenX, screenY;
    screenX = toFixedPrecision((x - this.x) * this.zoomLevel, 2);
    screenY = toFixedPrecision((y - this.y) * this.zoomLevel, 2);
    return new Vector(screenX, screenY);
  };

  Camera.prototype.unapplyCamera = function (x, y) {
    var gameX, gameY;
    gameX = toFixedPrecision(x / this.zoomLevel + this.x, 2);
    gameY = toFixedPrecision(y / this.zoomLevel + this.y, 2);
    return new Vector(gameX, gameY);
  };

  return Camera;
})();
