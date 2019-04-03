var Rectangle = require("./geometry/rectangle");
var Vector = require("./geometry/vector");

var AXIS = {
  NONE: "none",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  BOTH: "both"
};

function Camera(props) {
  /**
   *  Zoom level works as follows:
   *    zoom level = 0.5 -> object size is HALVED
   *    zoom level = 1 -> objects have their normal size
   *    zoom level = 2 -> object size is DOUBLED
   *    etc.
   */
  this.zoomLevel = props.zoomLevel || 1;
  this.height = canvas.height / this.zoomLevel;
  this.width = canvas.width / this.zoomLevel;
  this.canvas = props.canvas;
  this.worldRect = props.worldRect;

  this.zoomingRate = 1.1;

  Rectangle.call(this, {
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

Camera.prototype = Object.create(Rectangle.prototype);
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
    !new Rectangle({
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

Camera.prototype.zoomIn = function(x, y) {
  var centerX = x !== undefined ? x : this.followed.center.x;
  var centerY = y !== undefined ? y : this.followed.center.y;

  this.zoomLevel *= this.zoomingRate;
  if (this.zoomLevel > 8) {
    this.zoomLevel = 8;
  } else {
    this.x = (this.x - centerX) / this.zoomingRate + centerX;
    this.y = (this.y - centerY) / this.zoomingRate + centerY;
  }
};

Camera.prototype.zoomOut = function(x, y) {
  var centerX = x !== undefined ? x : this.followed.center.x;
  var centerY = y !== undefined ? y : this.followed.center.y;

  this.zoomLevel /= this.zoomingRate;
  if (this.zoomLevel < 0.02) {
    this.zoomLevel = 0.02;
  } else {
    this.x = (this.x - centerX) * this.zoomingRate + centerX;
    this.y = (this.y - centerY) * this.zoomingRate + centerY;
  }
};

/*
    Transform game coordinates to screen coordinates, or transform game length to screen length.
  */
Camera.prototype.applyToX = function(x) {
  return Math.round((x - this.x) * this.zoomLevel);
};

Camera.prototype.applyToY = function(y) {
  return Math.round((y - this.y) * this.zoomLevel);
};

Camera.prototype.apply = function(x, y) {
  return new Vector(this.applyToX(x), this.applyToY(y));
};

Camera.prototype.applyToDistance = function(distance) {
  return Math.round(distance * this.zoomLevel);
};

/*
    Transform screen coordinates to game coordinates, or transform screen length to game length.
  */
Camera.prototype.unapplyToX = function(x) {
  return Math.round(x / this.zoomLevel + this.x);
};

Camera.prototype.unapplyToY = function(y) {
  return Math.round(y / this.zoomLevel + this.y);
};

Camera.prototype.unapply = function(x, y) {
  return new Vector(this.unapplyToX(x), this.unapplyToY(y));
};

Camera.prototype.unapplyToDistance = function(distance) {
  return Math.round(distance / this.zoomLevel);
};

module.exports = Camera;
