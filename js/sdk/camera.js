var Camera = (function() {
  var AXIS = {
    NONE: "none",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    BOTH: "both"
  };

  function Camera(props) {
    this.zoomLevel = props.zoomLevel || 1;
    this.height = canvas.height / this.zoomLevel;
    this.width = canvas.width / this.zoomLevel;
    this.canvas = props.canvas;
    this.worldRect = props.worldRect;

    AABB.call(this, {
      x: props.x,
      y: props.y,
      width: this.canvas.width,
      height: this.canvas.height
    });

    this.xDeadZone = this.canvas.width / 3; // min distance to horizontal borders
    this.yDeadZone = this.canvas.height / 3; // min distance to vertical borders

    this.axis = AXIS.BOTH;

    this.followed = null;

    this.shouldStayWithinWorldBounds = false;
  }

  Camera.prototype = Object.create(AABB.prototype);
  Camera.prototype.constructor = Camera;

  Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.x = this.followed.center.x - this.width / 2;
    this.y = this.followed.center.y - this.height / 2;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
    // this.xClearZone = xClearZone;
    // this.yClearZone = yClearZone;
  };

  Camera.prototype.update = function() {
    this.updateDimensions();
    if (this.followed) {
      var xDeadZone = Math.min(
        (this.width - this.followed.width) / 2,
        this.yDeadZone
      );
      var yDeadZone = Math.min(
        (this.height - this.followed.height) / 2,
        this.xDeadZone
      );
    }

    // keep following the player (or other desired object)
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if (this.followed.right + xDeadZone > this.right) {
          this.x = this.followed.right + xDeadZone - this.width;
        } else if (this.followed.left - xDeadZone < this.left) {
          this.x = this.followed.left - xDeadZone;
        }
      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if (this.followed.bottom + yDeadZone > this.bottom) {
          this.y = this.followed.bottom + yDeadZone - this.height;
        } else if (this.followed.top - yDeadZone < this.top) {
          this.y = this.followed.top - yDeadZone;
        }
      }
    }

    // don't let camera leave the world's boundaries
    if (
      this.shouldStayWithinWorldBounds &&
      !new AABB({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      }).within(this.worldRect)
    ) {
      if (this.x < this.worldRect.left) {
        this.x = this.worldRect.left;
      }
      if (this.y < this.worldRect.top) {
        this.y = this.worldRect.top;
      }
      if (this.x + this.width > this.worldRect.right) {
        this.x = this.worldRect.right - this.width;
      }
      if (this.y + this.height > this.worldRect.bottom) {
        this.y = this.worldRect.bottom - this.height;
      }
    }
  };

  Camera.prototype.updateDimensions = function() {
    this.height = this.canvas.height / this.zoomLevel;
    this.width = this.canvas.width / this.zoomLevel;
  };

  Camera.prototype.zoomIn = function() {
    this.zoomLevel *= 1.1;
    this.height = this.canvas.height / this.zoomLevel;
    this.width = this.canvas.width / this.zoomLevel;
    this.x = this.followed.center.x - this.width / 2;
    this.y = this.followed.center.y - this.height / 2;
  };

  Camera.prototype.zoomOut = function() {
    this.zoomLevel /= 1.1;
    this.height = this.canvas.height / this.zoomLevel;
    this.width = this.canvas.width / this.zoomLevel;
    this.x = this.followed.center.x - this.width / 2;
    this.y = this.followed.center.y - this.height / 2;
  };

  Camera.prototype.apply = function(x, y) {
    var screenX, screenY;
    screenX = toFixedPrecision((x - this.x) * this.zoomLevel, 4);
    screenY = toFixedPrecision((y - this.y) * this.zoomLevel, 4);
    return new Vector(screenX, screenY);
  };

  Camera.prototype.unapply = function(x, y) {
    var gameX, gameY;
    gameX = toFixedPrecision(x / this.zoomLevel + this.x, 2);
    gameY = toFixedPrecision(y / this.zoomLevel + this.y, 2);
    return new Vector(gameX, gameY);
  };

  return Camera;
})();
