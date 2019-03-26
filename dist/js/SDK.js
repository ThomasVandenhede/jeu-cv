/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/sdk/SDK.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./js/sdk/Rectangle.js":
/*!*****************************!*\
  !*** ./js/sdk/Rectangle.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

function Rectangle(props) {
  this.x = props.x;
  this.y = props.y;
  this.width = props.width !== undefined ? props.width : 0;
  this.height = props.height !== undefined ? props.height : 0;
}

Object.defineProperties(Rectangle.prototype, {
  left: {
    get: function() {
      return this.width >= 0 ? this.x : this.x + this.width;
    },
    set: function(left) {
      this.x = left;
    }
  },
  top: {
    get: function() {
      return this.height >= 0 ? this.y : this.y + this.height;
    },
    set: function(left) {
      this.y = bottom;
    }
  },
  right: {
    get: function() {
      return this.width >= 0 ? this.x + this.width : this.x;
    },
    set: function(right) {
      if (this.width === Number.POSITIVE_INFINITY) {
        this.x = Number.NEGATIVE_INFINITY; // edge case
      } else {
        this.x = right - this.width;
      }
    }
  },
  bottom: {
    get: function() {
      return this.height >= 0 ? this.y + this.height : this.y;
    },
    set: function(bottom) {
      if (this.height === Number.POSITIVE_INFINITY) {
        this.y = Number.NEGATIVE_INFINITY; // edge case
      } else {
        this.y = bottom - this.height;
      }
    }
  },
  center: {
    get: function() {
      return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    },
    set: function(x, y) {
      this.x = x - this.width / 2;
      this.y = y - this.height / 2;
    }
  }
});

// static methods
Rectangle.minkowskiDifference = function(r1, r2) {
  return new Rectangle({
    x: r1.left - r2.right,
    y: r1.top - r2.bottom,
    width: r1.width + r2.width,
    height: r1.height + r2.height
  });
};

// public methods
Rectangle.prototype.inflate = function(dx, dy) {
  this.x -= dx;
  this.width += 2 * dx;
  this.y -= dy;
  this.height += 2 * dy;
  return this;
};

Rectangle.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
  return this;
};

Rectangle.prototype.getBoundingRect = function() {
  return this;
};

Rectangle.prototype.within = function(r) {
  return (
    r.left <= this.left &&
    r.right >= this.right &&
    r.top <= this.top &&
    r.bottom >= this.bottom
  );
};

Rectangle.prototype.overlaps = function(r) {
  return (
    this.left < r.right &&
    r.left < this.right &&
    this.top < r.bottom &&
    r.top < this.bottom
  );
};

Rectangle.prototype.contains = function(x, y) {
  return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
};

Rectangle.prototype.containsStrict = function(x, y) {
  return x > this.left && x < this.right && y > this.top && y < this.bottom;
};

module.exports = Rectangle;


/***/ }),

/***/ "./js/sdk/SDK.js":
/*!***********************!*\
  !*** ./js/sdk/SDK.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var SDK = {
  Rectangle: __webpack_require__(/*! ./Rectangle */ "./js/sdk/Rectangle.js"),
  Camera: __webpack_require__(/*! ./camera */ "./js/sdk/camera.js"),
  Circle: __webpack_require__(/*! ./circle */ "./js/sdk/circle.js"),
  GameTimer: __webpack_require__(/*! ./gameTimer */ "./js/sdk/gameTimer.js"),
  Grid: __webpack_require__(/*! ./grid */ "./js/sdk/grid.js"),
  KeyboardManager: __webpack_require__(/*! ./keyboardManager */ "./js/sdk/keyboardManager.js"),
  MouseManager: __webpack_require__(/*! ./mouseManager */ "./js/sdk/mouseManager.js"),
  Particle: __webpack_require__(/*! ./particle */ "./js/sdk/particle.js"),
  physics: __webpack_require__(/*! ./physics */ "./js/sdk/physics.js"),
  Segment: __webpack_require__(/*! ./segment */ "./js/sdk/segment.js"),
  Sound: __webpack_require__(/*! ./sound */ "./js/sdk/sound.js"),
  SoundManager: __webpack_require__(/*! ./soundManager */ "./js/sdk/soundManager.js"),
  Tile: __webpack_require__(/*! ./tile */ "./js/sdk/tile.js"),
  Tilemap: __webpack_require__(/*! ./tilemap */ "./js/sdk/tilemap.js"),
  TouchManager: __webpack_require__(/*! ./touchManager */ "./js/sdk/touchManager.js"),
  Vector: __webpack_require__(/*! ./vector */ "./js/sdk/vector.js")
};

module.exports = SDK;

global.SDK = SDK;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ "../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./js/sdk/camera.js":
/*!**************************!*\
  !*** ./js/sdk/camera.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Rectangle = __webpack_require__(/*! ./Rectangle */ "./js/sdk/Rectangle.js");
var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

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

  Camera.prototype.applyToX = function(x) {
    return Math.round((x - this.x) * this.zoomLevel);
  };

  Camera.prototype.applyToY = function(y) {
    return Math.round((y - this.y) * this.zoomLevel);
  };

  Camera.prototype.apply = function(x, y) {
    return new Vector(this.applyToX(x), this.applyToY(y));
  };

  Camera.prototype.unapplyToX = function(x) {
    return Math.round(x / this.zoomLevel + this.x);
  };

  Camera.prototype.unapplyToY = function(y) {
    return Math.round(y / this.zoomLevel + this.y);
  };

  Camera.prototype.unapply = function(x, y) {
    return new Vector(this.unapplyToX(x), this.unapplyToY(y));
  };

  Camera.prototype.applyToDistance = function(distance) {
    return Math.round(distance * this.zoomLevel);
  };

  Camera.prototype.unapplyToDistance = function(distance) {
    return Math.round(distance / this.zoomLevel);
  };

  return Camera;
})();

module.exports = Camera;


/***/ }),

/***/ "./js/sdk/circle.js":
/*!**************************!*\
  !*** ./js/sdk/circle.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Rectangle = __webpack_require__(/*! ./Rectangle */ "./js/sdk/Rectangle.js");
var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

var Circle = (function() {
  /**
   * A generic circle class.
   * @param {number} x
   * @param {number} y
   * @param {number} r
   */
  function Circle(x, y, r) {
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 0;
  }

  Object.defineProperties(Circle.prototype, {
    diameter: {
      get: function() {
        return this.r * 2;
      }
    },
    center: {
      get: function() {
        return new Vector(this.x, this.y);
      }
    },
    area: {
      get: function() {
        return Math.PI * this.r * this.r;
      }
    },
    left: {
      get: function() {
        return this.x - this.r;
      }
    },
    right: {
      get: function() {
        return this.x + this.r;
      }
    },
    top: {
      get: function() {
        return this.y - this.r;
      }
    },
    bottom: {
      get: function() {
        return this.y + this.r;
      }
    }
  });

  Circle.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  /**
   * Determines whether the circle contains a point.
   * @param {number} x
   * @param {number} y
   */
  Circle.prototype.containsPoint = function(x, y) {
    return (
      Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.r, 2)
    );
  };

  Circle.prototype.getBoundingRect = function() {
    return new Rectangle({
      x: this.x - this.r,
      y: this.y - this.r,
      width: this.r * 2,
      height: this.r * 2
    });
  };

  return Circle;
})();

module.exports = Circle;


/***/ }),

/***/ "./js/sdk/gameTimer.js":
/*!*****************************!*\
  !*** ./js/sdk/gameTimer.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(/*! ../utils */ "./js/utils.js");

var GameTimer = (function() {
  function GameTimer() {}

  Object.defineProperties(GameTimer.prototype, {
    dt: {
      get: function() {
        return utils.toFixedPrecision(
          (this.currentTime - this.previousTime) / 1000,
          4
        );
      }
    }
  });

  GameTimer.prototype.update = function() {
    this.previousTime = this.currentTime;
    this.currentTime = Date.now();
    this.totalTime += this.currentTime - this.previousTime;
  };

  GameTimer.prototype.reset = function() {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
  };

  return GameTimer;
})();

module.exports = GameTimer;


/***/ }),

/***/ "./js/sdk/grid.js":
/*!************************!*\
  !*** ./js/sdk/grid.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

var Grid = (function() {
  function Grid(props) {
    this.camera = props.camera;
    this.canvas = props.canvas;
    this.mouse = props.mouse;
    this.options = props.options;

    // grid config
    this.cursorSize = 10;
    this.cursorColor = "white";
    this.innerGridSize = 100;
    this.precisionAreaSize = this.innerGridSize;
    this.precisionGridSize = this.innerGridSize / 10;
    this.isPrecisionAreaRound = false; // otherwise square
  }

  Grid.prototype.getMousePosSnappedToGrid = function(mouseX, mouseY) {
    var camera = this.camera;
    var precisionGridSize = this.precisionGridSize;

    var mouseGamePos = camera.unapply(mouseX, mouseY);
    var snappedMouseGamePos = new Vector(
      Math.round(mouseGamePos.x / precisionGridSize) * precisionGridSize,
      Math.round(mouseGamePos.y / precisionGridSize) * precisionGridSize
    );
    return camera.apply(snappedMouseGamePos.x, snappedMouseGamePos.y);
  };

  Grid.prototype.getMouseGamePosSnappedToGrid = function(mouseX, mouseY) {
    var camera = this.camera;
    var mousePosSnappedToGrid = this.getMousePosSnappedToGrid(mouseX, mouseY);
    return camera.unapply(mousePosSnappedToGrid.x, mousePosSnappedToGrid.y);
  };

  Grid.prototype._drawRulers = function(ctx, camera) {
    var innerGridSize = this.innerGridSize;
    var minX = Math.floor(camera.left / innerGridSize, 2) * innerGridSize;
    var maxX = Math.ceil(camera.right / innerGridSize, 2) * innerGridSize;
    var minY = Math.floor(camera.top / innerGridSize, 2) * innerGridSize;
    var maxY = Math.ceil(camera.bottom / innerGridSize, 2) * innerGridSize;

    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = gameData.colors.STAR_WARS_YELLOW; // Star Wars yellow
    ctx.strokeStyle = "white";
    for (var i = minX; i <= maxX; i += innerGridSize) {
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(i), camera.applyToY(camera.top));
      ctx.lineTo(camera.applyToX(i), camera.applyToY(camera.top) + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(i), camera.applyToY(camera.bottom));
      ctx.lineTo(camera.applyToX(i), camera.applyToY(camera.bottom) - 10);
      ctx.stroke();
      if (i % (innerGridSize * 5) === 0) {
        ctx.fillText(
          i,
          camera.applyToX(i) + 10,
          camera.applyToY(camera.top) + 20
        );
        ctx.fillText(
          i,
          camera.applyToX(i) + 10,
          camera.applyToY(camera.bottom) - 10
        );
      }
    }
    for (var i = minY; i <= maxY; i += innerGridSize) {
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(camera.left), camera.applyToY(i));
      ctx.lineTo(camera.applyToX(camera.left) + 10, camera.applyToY(i));
      ctx.stroke();
      ctx.moveTo(camera.applyToX(camera.right), camera.applyToY(i));
      ctx.lineTo(camera.applyToX(camera.right) - 10, camera.applyToY(i));
      ctx.stroke();
      if (i % (innerGridSize * 5) === 0) {
        ctx.textAlign = "left";
        ctx.fillText(
          -i,
          camera.applyToX(camera.left) + 10,
          camera.applyToY(i) - 10
        );
        ctx.textAlign = "right";
        ctx.fillText(
          -i,
          camera.applyToX(camera.right) - 10,
          camera.applyToY(i) - 10
        );
      }
    }
    ctx.restore();
  };

  Grid.prototype._drawInnerGrid = function(ctx, camera) {
    var innerGridSize = this.innerGridSize;
    var minX = Math.floor(camera.left / innerGridSize, 2) * innerGridSize;
    var maxX = Math.ceil(camera.right / innerGridSize, 2) * innerGridSize;
    var minY = Math.floor(camera.top / innerGridSize, 2) * innerGridSize;
    var maxY = Math.ceil(camera.bottom / innerGridSize, 2) * innerGridSize;

    for (var i = minX; i <= maxX; i += innerGridSize) {
      if (i % (innerGridSize * 5) === 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      }
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(i), camera.applyToY(camera.top));
      ctx.lineTo(camera.applyToX(i), camera.applyToY(camera.bottom));
      ctx.stroke();
    }
    for (var j = minY; j <= maxY; j += innerGridSize) {
      if (j % (innerGridSize * 5) === 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      }
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(camera.left), camera.applyToY(j));
      ctx.lineTo(camera.applyToX(camera.right), camera.applyToY(j));
      ctx.stroke();
    }
  };

  Grid.prototype._drawPrecisionArea = function(ctx, camera) {
    var mousePos = this.getMousePosSnappedToGrid(this.mouse.x, this.mouse.y);
    var precisionAreaGameSize = this.precisionAreaSize * camera.zoomLevel;
    var precisionGridSize = this.precisionGridSize * camera.zoomLevel;
    var minX = Math.floor(mousePos.x - precisionAreaGameSize / 2);
    var maxX = Math.ceil(mousePos.x + precisionAreaGameSize / 2);
    var minY = Math.floor(mousePos.y - precisionAreaGameSize / 2);
    var maxY = Math.ceil(mousePos.y + precisionAreaGameSize / 2);
    ctx.strokeStyle = "grey";
    for (var i = minX; i <= maxX; i += precisionGridSize) {
      ctx.beginPath();
      ctx.moveTo(i, minY);
      ctx.lineTo(i, maxY);
      ctx.stroke();
    }
    for (var j = minY; j <= maxY; j += precisionGridSize) {
      ctx.beginPath();
      ctx.moveTo(minX, j);
      ctx.lineTo(maxX, j);
      ctx.stroke();
    }
  };

  Grid.prototype._drawCursor = function(ctx, camera) {
    var mousePos = this.getMousePosSnappedToGrid(this.mouse.x, this.mouse.y);
    var cursorSize = this.cursorSize;
    ctx.strokeStyle = this.cursorColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mousePos.x - cursorSize / 2, mousePos.y);
    ctx.lineTo(mousePos.x + cursorSize / 2, mousePos.y);
    ctx.moveTo(mousePos.x, mousePos.y - cursorSize / 2);
    ctx.lineTo(mousePos.x, mousePos.y + cursorSize / 2);
    ctx.stroke();
    ctx.restore();
  };

  Grid.prototype._displayCoordinates = function(ctx, camera) {
    var mousePos = this.getMousePosSnappedToGrid(this.mouse.x, this.mouse.y);
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#ccc";
    var mouseGamePos = camera.unapply(mousePos.x, mousePos.y);
    ctx.fillText(
      mouseGamePos.x + ", " + mouseGamePos.y,
      mousePos.x + 20,
      mousePos.y - 20
    );
  };

  Grid.prototype.draw = function(ctx, camera, options) {
    var camera = this.camera;

    // update mouse precision for performance
    if (camera.zoomLevel <= 0.3) {
      this.innerGridSize = 1000;
    } else if (camera.zoomLevel < 0.5) {
      this.innerGridSize = 100;
    } else if (camera.zoomLevel < 3) {
      this.innerGridSize = 50;
    } else if (camera.zoomLevel < 5) {
      this.innerGridSize = 10;
    }
    this.precisionAreaSize = this.innerGridSize;
    this.precisionGridSize = this.precisionAreaSize / 10;

    this.options.shouldDisplayRulers && this._drawRulers(ctx, camera);
    !this.options.isGame && this._drawInnerGrid(ctx, camera);
    // this._drawPrecisionArea(ctx, camera);
    !this.options.isGame && this._drawCursor(ctx, camera);
    !this.options.isGame && this._displayCoordinates(ctx, camera);
    !this.options.isGame &&
      this.options.shouldDisplayRulers &&
      this._drawRulers(ctx, camera);
  };

  return Grid;
})();

module.exports = Grid;


/***/ }),

/***/ "./js/sdk/keyboardManager.js":
/*!***********************************!*\
  !*** ./js/sdk/keyboardManager.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var KeyboardManager = (function() {
  // supported keys
  var codeMappings = {
    ArrowLeft: "LEFT",
    ArrowUp: "UP",
    ArrowRight: "RIGHT",
    ArrowDown: "DOWN",
    KeyW: "UP",
    KeyA: "LEFT",
    KeyS: "DOWN",
    KeyD: "RIGHT",
    KeyG: "G",
    Enter: "ENTER",
    Space: "SPACE",
    Escape: "ESCAPE",
    Equal: "EQUAL",
    Minus: "MINUS"
  };
  var keyCodeMappings = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    90: "UP",
    81: "LEFT",
    93: "DOWN",
    68: "RIGHT",
    13: "ENTER",
    32: "SPACE",
    27: "ESCAPE",
    187: "EQUAL",
    219: "MINUS"
  };

  function KeyboardManager(game) {
    this.game = game; // reference to the game object

    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.bindEventHandlers();
  }

  KeyboardManager.prototype.handleKeydown = function handleKeydown(event) {
    var code = event.code || event.keyCode;
    var mappings = event.code ? codeMappings : keyCodeMappings;
    if (mappings[code] && !this[mappings[code]]) {
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false);
      this[mappings[code]] = true;
    }

    switch (event.keyCode) {
      case 27:
        this.game.state === "running" ? this.game.pause() : this.game.unpause();
        break;
      case 71:
        this.game.level.player.reverseGravity();
        break;
      // case 72:
      //   this.game.level.player.zeroGravity();
      //   break;
      default:
    }
  };

  KeyboardManager.prototype.handleKeyup = function handleKeyup(event) {
    var code = event.code || event.keyCode;
    var mappings = event.code ? codeMappings : keyCodeMappings;
    if (mappings[code]) {
      this[mappings[code]] = false;
    }
  };

  KeyboardManager.prototype.bindEventHandlers = function() {
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keyup", this.handleKeyup);
  };

  KeyboardManager.prototype.unbindEventHandlers = function() {
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("keyup", this.handleKeyup);
  };

  return KeyboardManager;
})();

module.exports = KeyboardManager;


/***/ }),

/***/ "./js/sdk/mouseManager.js":
/*!********************************!*\
  !*** ./js/sdk/mouseManager.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function MouseManager(app) {
  this.app = app;
  this.canvas = document.getElementById("canvas");
  // mouse config
  this.naturalScrolling = true;

  // mouse state
  this.buttons = {
    0: false,
    1: false,
    2: false
  };
  this.wheel = 0;
  this.clickX = 0;
  this.clickY = 0;
  this.releaseX = 0;
  this.releaseY = 0;
  this.x;
  this.y;
  this.dx = 0;
  this.dy = 0;
  this.grabbed = null;
  this.grabbedStartingX;
  this.grabbedStartingY;

  this.canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  });

  this.canvas.addEventListener(
    "mousedown",
    function(e) {
      this.clickX = e.clientX + this.canvas.offsetLeft;
      this.clickY = e.clientY + this.canvas.offsetTop;

      this.buttons[e.button] = true;
      switch (e.button) {
        case 1:
          // mouse wheel
          this.canvas.style.cursor = "move";
          this.grabbed = this.app.camera;
          this.grabbedStartingX = this.grabbed.x;
          this.grabbedStartingY = this.grabbed.y;
          break;
        default:
          break;
      }
    }.bind(this)
  );

  this.canvas.addEventListener(
    "mouseup",
    function(e) {
      this.releaseX = e.clientX + this.canvas.offsetLeft;
      this.releaseY = e.clientY + this.canvas.offsetTop;
      this.buttons[e.button] = false;
      switch (e.button) {
        case 1:
          // mouse wheel
          this.canvas.style.cursor = "";
          this.grabbed = null;
          break;
        default:
          break;
      }
    }.bind(this)
  );

  this.canvas.addEventListener(
    "mousemove",
    function(e) {
      var camera = this.app.camera;
      var scrollDirection = this.naturalScrolling ? 1 : -1;
      this.x = e.clientX + this.canvas.offsetLeft;
      this.y = e.clientY + this.canvas.offsetTop;

      // move camera when mouse wheel is held down
      if (this.buttons[1]) {
        this.grabbed.x =
          this.grabbedStartingX -
          (scrollDirection * (this.x - this.clickX)) / camera.zoomLevel;
        this.grabbed.y =
          this.grabbedStartingY -
          (scrollDirection * (this.y - this.clickY)) / camera.zoomLevel;
      }
    }.bind(this)
  );

  this.canvas.addEventListener(
    "wheel",
    function(e) {
      var camera = this.app.camera;
      var deltaY = e.deltaY;
      var mouseGamePosSnappedToGrid = this.app.grid.getMouseGamePosSnappedToGrid(
        this.x,
        this.y
      );

      deltaY > 0
        ? camera.zoomIn(
            mouseGamePosSnappedToGrid.x,
            mouseGamePosSnappedToGrid.y
          )
        : camera.zoomOut(
            mouseGamePosSnappedToGrid.x,
            mouseGamePosSnappedToGrid.y
          );
    }.bind(this)
  );
}

MouseManager.prototype.on = function(el, type, callback) {
  // console.log("ON", el, type, callback);
  el.addEventListener(type, callback, arguments[3]);
};

MouseManager.prototype.off = function(el, type, callback) {
  // console.log("OFF", el, type, callback);
  el.removeEventListener(type, callback, arguments[3]);
};

module.exports = MouseManager;


/***/ }),

/***/ "./js/sdk/particle.js":
/*!****************************!*\
  !*** ./js/sdk/particle.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

var Particle = (function() {
  function Particle(props) {
    Vector.call(this, props.x, props.y);

    this.size = props.size;
    this.color = props.color;

    this.v = new Vector(props.vx, props.vy);
    this.createdAt = Date.now();
    this.maxLife = props.maxLife;
  }

  Particle.prototype = Object.create(Vector.prototype);
  Particle.prototype.constructor = Particle;

  Particle.prototype.update = function() {
    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
  };

  Particle.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillRect(
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.size),
      camera.applyToDistance(this.size)
    );
  };

  return Particle;
})();

module.exports = Particle;


/***/ }),

/***/ "./js/sdk/physics.js":
/*!***************************!*\
  !*** ./js/sdk/physics.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Segment = __webpack_require__(/*! ./segment */ "./js/sdk/segment.js");
var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");
var utils = __webpack_require__(/*! ../utils */ "./js/utils.js");

var physics = {
  collision: {
    RectangleWithRectangle: function(r1, r2) {
      return (
        r1.left <= r2.right &&
        r1.right >= r2.left &&
        r1.top <= r2.bottom &&
        r1.bottom >= r2.top
      );
    },
    circleWithSegment: function(c, s) {
      var C = new Vector(c.x, c.y);
      var H = s.getPointOfIntersectionWithCircle(c);

      if (H) {
        return H;
      }
      return false;
    },
    lineSegmentCollision: function(A, B, O, P) {
      var AB = Vector.subtract(B, A);
      var AP = Vector.subtract(P, A);
      var AO = Vector.subtract(O, A);
      return Vector.determinant(AB, AP) * Vector.determinant(AB, AO) < 0;
    },
    segmentWithSegment: function(A, B, O, P) {
      if (!this.lineSegmentCollision(A, B, O, P)) {
        return Number.POSITIVE_INFINITY;
      }
      var AB = Vector.subtract(B, A);
      var OP = Vector.subtract(P, O);
      var numerator = -(A.x * OP.y - O.x * OP.y - OP.x * A.y + OP.x * O.y);
      var denominator = Vector.determinant(AB, OP);
      k = utils.toFixedPrecision(numerator / denominator, 2);

      if (k < 0 || k > 1) {
        return Number.POSITIVE_INFINITY;
      } else {
        return k;
      }
    },
    segmentRectangle: function(A, B, box) {
      var AB = Vector.subtract(B, A);
      var points = [
        new Vector(box.left, box.top),
        new Vector(box.right, box.top),
        new Vector(box.right, box.bottom),
        new Vector(box.left, box.bottom)
      ];
      var rayFraction = Number.POSITIVE_INFINITY;
      var sides = [[0, 1], [-1, 0], [0, -1], [1, 0]];
      var side;

      for (var i = 0; i < 4; i++) {
        var edge = new Segment(points[i], points[(i + 1) % 4]);
        var newRayFraction = this.segmentWithSegment(A, B, edge.A, edge.B);
        if (newRayFraction < rayFraction) {
          rayFraction = newRayFraction;
          side = sides[i];
        }
      }

      return {
        t: rayFraction,
        side: side
      };
    }
  }
};

module.exports = physics;


/***/ }),

/***/ "./js/sdk/segment.js":
/*!***************************!*\
  !*** ./js/sdk/segment.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Rectangle = __webpack_require__(/*! ./Rectangle */ "./js/sdk/Rectangle.js");
var Vector = __webpack_require__(/*! ./vector */ "./js/sdk/vector.js");

var Segment = (function() {
  function Segment(A, B, color) {
    this.A = A;
    this.B = B;
    this.color = color;
  }

  Segment.prototype.getBoundingRect = function() {
    return new Rectangle({
      x: Math.min(this.A.x, this.B.x),
      y: Math.min(this.A.y, this.B.y),
      width: Math.abs(this.B.x - this.A.x),
      height: Math.abs(this.B.y - this.A.y)
    });
  };

  Segment.prototype.isOrthogonalProjectedPointOnSegment = function(P) {
    var AB = Vector.subtract(this.B, this.A);
    var AP = Vector.subtract(P, this.A);
    var BP = Vector.subtract(P, this.B);
    return Vector.dotProduct(AB, AP) * Vector.dotProduct(AB, BP) <= 0;
  };

  Segment.prototype.getOrthogonalProjectionOfPoint = function(P) {
    var u = Vector.subtract(this.B, this.A).getUnitVector();
    var AP = Vector.subtract(P, this.A);
    var AH = Vector.dotProduct(AP, u);

    return Vector.sum(this.A, u.scale(AH));
  };

  Segment.prototype.getDistanceFromPoint = function(P) {
    // return Vector.subtract(this.getOrthogonalProjectionOfPoint(P), P).norm;
    var AB = Vector.subtract(this.B, this.A);
    var t = Vector.dotProduct(Vector.subtract(P, this.A), AB) / AB.norm;
    if (t < 0) {
      return Vector.subtract(A, P).norm;
    } else if (t > 1) {
      return Vector.subtract(B, P).norm;
    } else {
    }
  };

  Segment.prototype.getDistanceFromPointToLine = function(P) {
    var n = Vector.subtract(this.B, this.A)
      .getUnitVector()
      .getNormalVector();
    var d = Math.abs(Vector.dotProduct(Vector.subtract(P, this.A), n));
    return d;
  };

  Segment.prototype.getClosestPointOnSegment = function(P) {
    var AP = Vector.subtract(P, this.A);
    var AB = Vector.subtract(this.B, this.A);
    var normAB = AB.norm;
    var u = AB.scale(1 / normAB); // unit vector of AB
    var t = Vector.dotProduct(AP, u) / normAB;

    if (t < 0) {
      return this.A;
    } else if (t > 1) {
      return this.B;
    } else {
      var AH = Vector.dotProduct(AP, u);
      return Vector.sum(this.A, u.scale(AH));
    }
  };

  Segment.prototype.getPointOfIntersectionWithCircle = function(c) {
    var C = new Vector(c.x, c.y);
    var H = this.getClosestPointOnSegment(C);
    if ((CH = Vector.subtract(H, C).normSquared < Math.pow(c.r, 2))) {
      return H;
    }
    return false;
  };

  // Segment.prototype.intersectSegment = function(O, P) {
  //   var AB = Vector.subtract(this.B, this.A);
  //   var OP = Vector.subtract(P, O);
  //   if (!CollisionDroiteSeg(A, B, O, P)) {
  //     return false;
  //   }
  //   var k =
  //     -(this.A.x * OP.y - O.x * OP.y - OP.x * this.A.y + OP.x * O.y) /
  //     (AB.x * OP.y - AB.y * OP.x);
  //   return !(k < 0 || k > 1);
  // };

  Segment.prototype.draw = function(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.A.x, this.A.y);
    ctx.lineTo(this.B.x, this.B.y);
    ctx.stroke();
    ctx.restore();
  };

  return Segment;
})();

module.exports = Segment;


/***/ }),

/***/ "./js/sdk/sound.js":
/*!*************************!*\
  !*** ./js/sdk/sound.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function Sound(src, volume, options) {
  if (options) {
    this.sound.loop = options.loop || false;
    this.sound.isMusic = options.isMusic || false;
  }
  this.sound = new Audio(src);
  this.sound.volume = volume !== undefined ? volume : 1;
  this.isPlaying = false;
}

Sound.prototype.play = function() {
  this.sound.play();
  this.isPlaying = true;
};

Sound.prototype.pause = function() {
  this.sound.pause();
  this.isPlaying = true;
};

Sound.prototype.stop = function() {
  this.pause();
  this.rewind();
};

Sound.prototype.rewind = function() {
  this.sound.currentTime = 0;
};

Sound.prototype.replay = function() {
  this.rewind();
  this.play();
};

module.exports = Sound;


/***/ }),

/***/ "./js/sdk/soundManager.js":
/*!********************************!*\
  !*** ./js/sdk/soundManager.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Sound = __webpack_require__(/*! ./sound */ "./js/sdk/sound.js");

var SoundManager = (function() {
  function SoundManager(gameData) {
    this.masterVolume = 1;
    this.sounds = {};
    this.musics = {};
    this.pausedSounds = [];

    var soundData = gameData.sounds;
    var musicData = gameData.musics;
    var location, files;

    location = soundData.location;
    files = soundData.files;
    // load sounds
    files.forEach(function(file) {
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }, this);

    location = musicData.location;
    files = musicData.files;
    // load musics
    files.forEach(function(file) {
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }, this);
  }

  SoundManager.prototype.stopAll = function() {
    for (var sound in this.sounds) {
      sound.stop();
    }
  };

  SoundManager.prototype.pauseAll = function() {
    for (var sound in this.sounds) {
      if (sound.isPlaying) {
        this.pausedSounds.push(sound);
        sound.pause();
      }
    }
  };

  SoundManager.prototype.playPaused = function() {
    this.pausedSounds.forEach(function(pausedSound) {
      pausedSound.play();
    });
  };

  return SoundManager;
})();

module.exports = SoundManager;


/***/ }),

/***/ "./js/sdk/tile.js":
/*!************************!*\
  !*** ./js/sdk/tile.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

function Tile(x, y, size, src) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.image = new Image();
  this.image.src = src;
}

Tile.prototype.draw = function(ctx, camera) {
  ctx.save();
  ctx.drawImage(
    this.image,
    camera.applyToX(this.x),
    camera.applyToY(this.y),
    camera.applyToDistance(this.size),
    camera.applyToDistance(this.size)
  );
  ctx.restore();
};

module.exports = Tile;


/***/ }),

/***/ "./js/sdk/tilemap.js":
/*!***************************!*\
  !*** ./js/sdk/tilemap.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Tile = __webpack_require__(/*! ./tile */ "./js/sdk/tile.js");

function TileMap() {
  this.rows = 100;
  this.columns = 100;
  this.tileSize = 40;

  this.data = {
    tiles: [
      {
        row: -20,
        column: 0,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -20,
        column: 1,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -20,
        column: 2,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -20,
        column: 3,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -20,
        column: 3,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -20,
        column: 4,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -21,
        column: 4,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -21,
        column: 5,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -21,
        column: 6,
        src: "./assets/images/smoke1.png"
      },
      {
        row: -21,
        column: 7,
        src: "./assets/images/smoke1.png"
      },
      {
        row: -21,
        column: 8,
        src: "./assets/images/smoke1.png"
      },
      {
        row: -21,
        column: 9,
        src: "./assets/images/smoke2.png"
      },
      {
        row: -21,
        column: 10,
        src: "./assets/images/bootstrap-logo.png"
      },
      {
        row: -20,
        column: 10,
        src: "./assets/images/bootstrap-logo.png"
      },
      {
        row: -19,
        column: 10,
        src: "./assets/images/bootstrap-logo.png"
      },
      {
        row: -18,
        column: 10,
        src: "./assets/images/smoke2.png"
      }
    ]
  };
  this.tiles = [];
  this.data.tiles.forEach(function(tileData) {
    var x = this.tileSize * tileData.column;
    var y = this.tileSize * tileData.row;
    var tile = new Tile(x, y, this.tileSize, tileData.src);
    this.tiles.push(tile);
  }, this);
}

TileMap.prototype.draw = function(ctx, camera) {
  this.tiles.forEach(function(tile) {
    tile.draw(ctx, camera);
  }, this);
};

module.exports = TileMap;


/***/ }),

/***/ "./js/sdk/touchManager.js":
/*!********************************!*\
  !*** ./js/sdk/touchManager.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var TouchInput = (function(game) {
  /**
   * Joypad class. Enables creating virtual "touch" joypads on-the-fly.
   */
  var Joypad = (function() {
    function Joypad(game) {
      // reference to the game object
      this.game = game;

      // minimum distance travelled by joypad to trigger action
      this.JOYPAD_THRESHOLD_X = 10;
      this.JOYPAD_THRESHOLD_Y = 10;

      // joypad
      var joypadOuter = document.getElementById("joypad-outer");
      var joypad = document.getElementById("joypad");
      this.joypadInitialLeft = parseInt(window.getComputedStyle(joypad).left);
      this.joypadInitialTop = parseInt(window.getComputedStyle(joypad).top);

      var handleJoypadTouch = function(event) {
        event.preventDefault();

        // disable transitions
        joypad.style.transition = null;

        var joypadBoundingRect = joypadOuter.getBoundingClientRect();
        var joypadCenterX = joypadBoundingRect.x + joypadBoundingRect.width / 2;
        var joypadCenterY =
          joypadBoundingRect.y + joypadBoundingRect.height / 2;

        // retrieve the touch associated with this event
        var eventTouch = null;
        for (var i = 0; i < event.touches.length; i++) {
          var touch = event.touches.item(i);
          if (touch.target === joypadOuter || touch.target === joypad) {
            eventTouch = touch;
            break;
          }
        }

        // touch coordinates
        var touchX = eventTouch.pageX;
        var touchY = eventTouch.pageY;

        // joypad displacement
        var deltaX = touchX - joypadCenterX;
        var deltaY = touchY - joypadCenterY;
        var angle = Math.atan2(deltaY, deltaX);

        // confine joypad to the outer circle
        var maxDeltaX = (Math.cos(angle) * (joypadBoundingRect.width - 50)) / 2;
        var maxDeltaY =
          (Math.sin(angle) * (joypadBoundingRect.height - 50)) / 2;

        this.JOYPAD_LEFT = false;
        this.JOYPAD_RIGHT = false;
        if (deltaX > 0) {
          joypad.style.left =
            this.joypadInitialLeft + Math.min(maxDeltaX, deltaX) + "px";
          if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
            this.JOYPAD_RIGHT = true;
          }
        }
        if (deltaX < 0) {
          joypad.style.left =
            this.joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
          if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
            this.JOYPAD_LEFT = true;
          }
        }

        this.JOYPAD_UP = false;
        this.JOYPAD_DOWN = false;
        if (deltaY > 0) {
          joypad.style.top =
            this.joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
          // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
          //   this.JOYPAD_DOWN = true;
          // }
        }
        if (deltaY < 0) {
          joypad.style.top =
            this.joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
          // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
          //   this.JOYPAD_UP = true;
          // }
        }
      }.bind(this);

      joypadOuter.addEventListener("touchstart", handleJoypadTouch);
      joypadOuter.addEventListener("touchmove", handleJoypadTouch);
      joypadOuter.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          joypad.style.transition = "all 0.07s ease-in-out";
          joypad.style.top = this.joypadInitialTop + "px";
          joypad.style.left = this.joypadInitialLeft + "px";
          this.JOYPAD_UP = false;
          this.JOYPAD_DOWN = false;
          this.JOYPAD_RIGHT = false;
          this.JOYPAD_LEFT = false;
        }.bind(this)
      );
    }

    return Joypad;
  })();

  /**
   * Button class. Enables creating virtual "touch" buttons on-the-fly.
   */
  var Button = (function() {
    function Button(game) {
      // reference to the game object
      this.game = game;

      // mobile input
      var buttonLeft = document.getElementById("button-left-clickable-area");
      var buttonRight = document.getElementById("button-right-clickable-area");
      var buttonA = document.getElementById("button-a-clickable-area");
      var buttonB = document.getElementById("button-b-clickable-area");

      buttonLeft.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonLeft.classList.add("touched");
          this.BUTTON_LEFT = true;
        }.bind(this)
      );
      buttonLeft.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonLeft.classList.remove("touched");
          this.BUTTON_LEFT = false;
        }.bind(this)
      );
      buttonRight.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonRight.classList.add("touched");
          this.BUTTON_RIGHT = true;
        }.bind(this)
      );
      buttonRight.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonRight.classList.remove("touched");
          this.BUTTON_RIGHT = false;
        }.bind(this)
      );
      buttonA.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonA.classList.add("touched");
          this.BUTTON_A = true;
        }.bind(this)
      );
      buttonA.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonA.classList.remove("touched");
          this.BUTTON_A = false;
        }.bind(this)
      );
      buttonB.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonB.classList.add("touched");
          this.BUTTON_B = true;
        }.bind(this)
      );
      buttonB.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonB.classList.remove("touched");
          this.BUTTON_B = false;
        }.bind(this)
      );
    }

    return Button;
  })();

  // Public methods.
  return {
    addJoypad: function(name, props) {
      var joypad = new Joypad(game, props);
      this[name] = joypad;
      return joypad;
    },
    addButton: function(name, props) {
      var button = new Button(game, props);
      this[name] = button;
      return button;
    }
  };
})(window.game);

var TouchManager = (function() {
  function TouchManager(game) {
    // reference to the game object
    this.game = game;

    // minimum distance travelled by joypad to trigger action
    this.JOYPAD_THRESHOLD_X = 10;
    this.JOYPAD_THRESHOLD_Y = 10;

    // joypad
    this.joypadOuter = document.getElementById("joypad-outer");
    this.joypad = document.getElementById("joypad");
    this.joypadInitialLeft = parseInt(
      window.getComputedStyle(this.joypad).left
    );
    this.joypadInitialTop = parseInt(window.getComputedStyle(this.joypad).top);

    this.handleJoypadTouch = this.handleJoypadTouch.bind(this);
    this.handleJoypadTouchEnd = this.handleJoypadTouchEnd.bind(this);

    this.bindEventHandlers();

    // mobile input
    this.buttonLeft = document.getElementById("button-left-clickable-area");
    this.buttonRight = document.getElementById("button-right-clickable-area");
    this.buttonA = document.getElementById("button-a-clickable-area");
    this.buttonB = document.getElementById("button-b-clickable-area");

    this.buttonLeft.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonLeft.classList.add("touched");
        this.JOYPAD_LEFT = true;
      }.bind(this)
    );
    this.buttonLeft.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonLeft.classList.remove("touched");
        this.JOYPAD_LEFT = false;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.add("touched");
        this.JOYPAD_RIGHT = true;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.remove("touched");
        this.JOYPAD_RIGHT = false;
      }.bind(this)
    );
    this.buttonA.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonA.classList.add("touched");
        this.BUTTON_A = true;
      }.bind(this)
    );
    this.buttonA.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonA.classList.remove("touched");
        this.BUTTON_A = false;
      }.bind(this)
    );
    this.buttonB.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonB.classList.add("touched");
        this.BUTTON_B = true;
      }.bind(this)
    );
    this.buttonB.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonB.classList.remove("touched");
        this.BUTTON_B = false;
      }.bind(this)
    );
  }

  TouchManager.prototype.handleJoypadTouch = function handleJoypadTouch(event) {
    event.preventDefault();

    // disable transitions
    this.joypad.style.transition = null;

    var joypadBoundingRect = this.joypadOuter.getBoundingClientRect();
    var joypadCenterX = joypadBoundingRect.x + joypadBoundingRect.width / 2;
    var joypadCenterY = joypadBoundingRect.y + joypadBoundingRect.height / 2;

    // retrieve the touch associated with this event
    var eventTouch = null;
    for (var i = 0; i < event.touches.length; i++) {
      var touch = event.touches.item(i);
      if (touch.target === this.joypadOuter || touch.target === joypad) {
        eventTouch = touch;
        break;
      }
    }

    // touch coordinates
    var touchX = eventTouch.pageX;
    var touchY = eventTouch.pageY;

    // joypad displacement
    var deltaX = touchX - joypadCenterX;
    var deltaY = touchY - joypadCenterY;
    var angle = Math.atan2(deltaY, deltaX);

    // confine joypad to the outer circle
    var maxDeltaX = (Math.cos(angle) * (joypadBoundingRect.width - 50)) / 2;
    var maxDeltaY = (Math.sin(angle) * (joypadBoundingRect.height - 50)) / 2;

    this.JOYPAD_LEFT = false;
    this.JOYPAD_RIGHT = false;
    if (deltaX > 0) {
      this.joypad.style.left =
        this.joypadInitialLeft + Math.min(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_RIGHT = true;
      }
    }
    if (deltaX < 0) {
      this.joypad.style.left =
        this.joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_LEFT = true;
      }
    }

    this.JOYPAD_UP = false;
    this.JOYPAD_DOWN = false;
    if (deltaY > 0) {
      this.joypad.style.top =
        this.joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_DOWN = true;
      }
    }
    if (deltaY < 0) {
      this.joypad.style.top =
        this.joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_UP = true;
      }
    }
  };

  TouchManager.prototype.handleJoypadTouchEnd = function handleJoypadTouchEnd(
    event
  ) {
    event.preventDefault();
    this.joypad.style.transition = "all 0.07s ease-in-out";
    this.joypad.style.top = this.joypadInitialTop + "px";
    this.joypad.style.left = this.joypadInitialLeft + "px";
    this.JOYPAD_UP = false;
    this.JOYPAD_DOWN = false;
    this.JOYPAD_RIGHT = false;
    this.JOYPAD_LEFT = false;
  };

  TouchManager.prototype.bindEventHandlers = function bindEventHandlers() {
    this.joypadOuter.addEventListener("touchstart", this.handleJoypadTouch);
    this.joypadOuter.addEventListener("touchmove", this.handleJoypadTouch);
    this.joypadOuter.addEventListener("touchend", this.handleJoypadTouchEnd);
  };

  TouchManager.prototype.unbindEventHandlers = function unbindEventHandlers() {
    this.joypadOuter.removeEventListener("touchstart", this.handleJoypadTouch);
    this.joypadOuter.removeEventListener("touchmove", this.handleJoypadTouch);
    this.joypadOuter.removeEventListener("touchend", this.handleJoypadTouchEnd);
  };

  return TouchManager;
})();

module.exports = TouchManager;


/***/ }),

/***/ "./js/sdk/vector.js":
/*!**************************!*\
  !*** ./js/sdk/vector.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Vector = (function() {
  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // public static methods
  Vector.sum = function() {
    var x = 0,
      y = 0;
    for (var i = 0; i < arguments.length; i++) {
      x += arguments[i].x;
      y += arguments[i].y;
    }
    return new Vector(x, y);
  };

  Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  Vector.determinant = function(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  };

  Vector.dotProduct = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  };

  // public non static methods
  Vector.prototype.scale = function(a) {
    return new Vector(this.x * a, this.y * a);
  };

  Vector.prototype.getUnitVector = function() {
    if (this.normSquared === 0) {
      return new Vector();
    } else {
      return new Vector(this.x, this.y).scale(1 / this.norm);
    }
  };

  Vector.prototype.getNormalVector = function() {
    return new Vector(-this.y, this.x);
  };

  Vector.prototype.rotateRadians = function(angle) {
    return new Vector(
      Math.cos(angle) * this.x - Math.sin(angle) * this.y,
      Math.sin(angle) * this.x + Math.cos(angle) * this.y
    );
  };

  Object.defineProperties(Vector.prototype, {
    direction: {
      get: function() {
        return Math.atan2(this.y, this.x);
      },
      set: function(direction) {
        var norm = this.norm;
        this.x = norm * Math.cos(direction);
        this.y = norm * Math.sin(direction);
      }
    },
    normSquared: {
      get: function() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
      }
    },
    norm: {
      get: function() {
        return Math.sqrt(this.normSquared);
      },
      set: function(newNorm) {
        if (this.x === 0 && this.y === 0) {
          return;
        }
        var norm = this.norm;
        this.x *= newNorm / norm;
        this.y *= newNorm / norm;
      }
    }
  });

  return Vector;
})();

module.exports = Vector;


/***/ }),

/***/ "./js/utils.js":
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  toFixedPrecision: function(number, precision) {
    return +number.toFixed(precision || 0);
  },

  noop: function() {},

  randInt: function(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
  },

  lerp: function(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  },

  show: function(el) {
    el.classList.remove("hidden");
  },

  hide: function(el) {
    el.classList.add("hidden");
  },

  incrementID: (function() {
    var id = -1;
    return function() {
      id = id + 1;
      return id;
    };
  })(),

  h: function(type, props, children) {
    var el = document.createElement(type);
    var nodes, node;
    for (var key in props) {
      el.setAttribute(key, props[key]);
    }
    if (Array.isArray(children)) {
      nodes = children;
    } else {
      nodes = [children];
    }
    for (var i = 0; i < nodes.length; i++) {
      if (typeof nodes[i] === "string") {
        node = document.createTextNode(nodes[i]);
      } else {
        node = nodes[i];
      }
      el.appendChild(node);
    }
    return el;
  },

  /**
   * Build DOM from virtual DOM tree.
   * @param {Object} dom
   */
  render: function(vdom) {
    return (function renderNode(vdom) {
      if (vdom.split) return document.createTextNode(vdom);

      const element = document.createElement(vdom.type);
      const props = vdom.props || {};

      Object.keys(props).forEach(function(key) {
        // treat events separately
        if (typeof props[key] !== "function") {
          element.setAttribute(key, props[key]);
        }

        // events
        if (typeof props[key] === "function") {
          var eventType = key.substring(2); // remove the 'on' part
          element.addEventListener(eventType, props[key]);
        }
      });

      (vdom.children || []).forEach(function(vNode) {
        return element.appendChild(renderNode(vNode));
      });
      return element;
    })(vdom);
  },

  h: function() {
    var vNode = {};
    var type = arguments[0];
    var props = arguments[1];
    var children = Array.prototype.slice.call(arguments, 2);

    vNode.type = type;
    vNode.props = props;

    if (children.length) {
      vNode.children = children.reduce((acc, item) => {
        return Array.isArray(item) ? [...acc, ...item] : [...acc, item];
      }, []);
    } else {
      vNode.children = null;
    }

    return vNode;
  },

  emptyElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
};


/***/ })

/******/ });
//# sourceMappingURL=SDK.js.map