var Vector = require("./geometry/vector");

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
