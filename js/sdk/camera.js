var AXIS = {
  NONE: "none",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  BOTH: "both"
};

class Camera extends AABB {
  constructor(props) {
    super({
      x: props.x,
      y: props.y,
      width: props.canvas.width,
      height: props.canvas.height
    });
    this.zoomLevel = props.zoomLevel || 1;
    this.height = canvas.height / this.zoomLevel;
    this.width = canvas.width / this.zoomLevel;
    this.canvas = props.canvas;
    this.worldRect = props.worldRect;

    this.zoomingRate = 1.1;

    this.xDeadZone = this.canvas.width / 3; // min distance to horizontal borders
    this.yDeadZone = this.canvas.height / 3; // min distance to vertical borders

    this.axis = AXIS.BOTH;

    this.followed = null;

    this.shouldStayWithinWorldBounds = false;
  }

  follow(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.x = this.followed.center.x - this.width / 2;
    this.y = this.followed.center.y - this.height / 2;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
    // this.xClearZone = xClearZone;
    // this.yClearZone = yClearZone;
  }

  update() {
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
  }

  updateDimensions() {
    this.height = this.canvas.height / this.zoomLevel;
    this.width = this.canvas.width / this.zoomLevel;
  }

  zoomIn(x, y) {
    var centerX = x !== undefined ? x : this.followed.center.x;
    var centerY = y !== undefined ? y : this.followed.center.y;

    this.zoomLevel *= this.zoomingRate;
    if (this.zoomLevel > 8) {
      this.zoomLevel = 8;
    } else {
      this.x = (this.x - centerX) / this.zoomingRate + centerX;
      this.y = (this.y - centerY) / this.zoomingRate + centerY;
    }
  }

  zoomOut(x, y) {
    var centerX = x !== undefined ? x : this.followed.center.x;
    var centerY = y !== undefined ? y : this.followed.center.y;

    this.zoomLevel /= this.zoomingRate;
    if (this.zoomLevel < 0.02) {
      this.zoomLevel = 0.02;
    } else {
      this.x = (this.x - centerX) * this.zoomingRate + centerX;
      this.y = (this.y - centerY) * this.zoomingRate + centerY;
    }
  }

  apply(x, y) {
    var screenX, screenY;
    screenX = toFixedPrecision((x - this.x) * this.zoomLevel, 4);
    screenY = toFixedPrecision((y - this.y) * this.zoomLevel, 4);
    return new Vector(screenX, screenY);
  }

  unapply(x, y) {
    var gameX, gameY;
    gameX = toFixedPrecision(x / this.zoomLevel + this.x, 4);
    gameY = toFixedPrecision(y / this.zoomLevel + this.y, 4);
    return new Vector(gameX, gameY);
  }

  scale(d) {
    return d * this.zoomLevel;
  }

  unscale(d) {
    return d / this.zoomLevel;
  }
}
