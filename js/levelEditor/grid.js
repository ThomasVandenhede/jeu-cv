var Grid = (function() {
  function Grid(context) {
    this.context = context;
    this.camera = this.context.camera;
    this.canvas = this.context.canvas;
    this.mouse = this.context.mouse;

    // grid config
    this.crossSize = 5;
    this.cursorSize = 10;
    this.cursorColor = "white";
    this.precision = 10;
    this.innerGridSize = 100;
    this.precisionAreaSize = 100;
    this.isPrecisionAreaRound = false; // otherwise square
  }

  Grid.prototype._getMousePosSnappedToGrid = function() {
    var camera = this.camera;
    var applyCam = camera.applyCamera.bind(camera);
    var unapplyCam = camera.unapplyCamera.bind(camera);
    var precision = this.precision;
    var mouse = this.mouse;

    var mouseGamePos = unapplyCam(mouse.x, mouse.y);
    var snappedMouseGamePos = new Vector(
      Math.round(mouseGamePos.x / precision) * precision,
      Math.round(mouseGamePos.y / precision) * precision
    );
    return applyCam(snappedMouseGamePos.x, snappedMouseGamePos.y);
  };

  Grid.prototype._drawRulers = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    var minX = Math.floor(camera.left / 100, 2) * 100;
    var maxX = Math.ceil(camera.right / 100, 2) * 100;
    var minY = Math.floor(camera.top / 100, 2) * 100;
    var maxY = Math.ceil(camera.bottom / 100, 2) * 100;

    ctx.save();
    ctx.font = "bold " + 16 * camera.zoomLevel + "px Arial";
    ctx.fillStyle = "#ffd700"; // Star Wars yellow
    ctx.strokeStyle = "white";
    for (var i = minX; i <= maxX; i += 100) {
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(i, camera.top));
      ctx.lineTo.apply(ctx, applyCamToArr(i, camera.top + 10));
      ctx.stroke();
      ctx.moveTo.apply(ctx, applyCamToArr(i, camera.bottom - 10));
      ctx.lineTo.apply(ctx, applyCamToArr(i, camera.bottom));
      ctx.stroke();
      ctx.closePath();
      ctx.fillText.apply(
        ctx,
        [i].concat(applyCamToArr(i + 10, camera.top + 20))
      );
      ctx.fillText.apply(
        ctx,
        [i].concat(applyCamToArr(i + 10, camera.bottom - 20))
      );
    }
    for (var i = minY; i <= maxY; i += 100) {
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(camera.left, i));
      ctx.lineTo.apply(ctx, applyCamToArr(camera.left + 10, i));
      ctx.stroke();
      ctx.moveTo.apply(ctx, applyCamToArr(camera.right - 10, i));
      ctx.lineTo.apply(ctx, applyCamToArr(camera.right, i));
      ctx.stroke();
      ctx.closePath();
      ctx.textAlign = "left";
      ctx.fillText.apply(ctx, [-i].concat(applyCamToArr(camera.left + 20, i)));
      ctx.textAlign = "right";
      ctx.fillText.apply(ctx, [-i].concat(applyCamToArr(camera.right - 20, i)));
    }
  };

  Grid.prototype._drawInnerGrid = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    var innerGridSize = this.innerGridSize;
    var minX = Math.floor(camera.x / innerGridSize, 2) * innerGridSize;
    var maxX =
      Math.ceil((camera.x + camera.width) / innerGridSize, 2) * innerGridSize;
    var minY = Math.floor(camera.y / innerGridSize, 2) * innerGridSize;
    var maxY =
      Math.ceil((camera.y + camera.height) / innerGridSize, 2) * innerGridSize;

    for (var i = minX; i <= maxX; i += innerGridSize) {
      for (var j = minY; j <= maxY; j += innerGridSize) {
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.moveTo.apply(ctx, applyCamToArr(i - this.crossSize, j));
        ctx.lineTo.apply(ctx, applyCamToArr(i + this.crossSize, j));
        ctx.moveTo.apply(ctx, applyCamToArr(i, j - this.crossSize));
        ctx.lineTo.apply(ctx, applyCamToArr(i, j + this.crossSize));
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  Grid.prototype._drawPrecisionArea = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    var camPrecisionAreaSize = this.precisionAreaSize * camera.zoomLevel;
    var mousePos = this._getMousePosSnappedToGrid();
    ctx.strokeStyle = "grey";
    for (
      var i = mousePos.x - camPrecisionAreaSize / 2;
      i <= mousePos.x + camPrecisionAreaSize / 2;
      i += this.precision * camera.zoomLevel
    ) {
      for (
        var j = mousePos.y - camPrecisionAreaSize / 2;
        j <= mousePos.y + camPrecisionAreaSize / 2;
        j += this.precision * camera.zoomLevel
      ) {
        if (
          !this.isPrecisionAreaRound ||
          Math.pow(i - mousePos.x, 2) + Math.pow(j - mousePos.y, 2) <=
            Math.pow(camPrecisionAreaSize / 2, 2)
        ) {
          ctx.beginPath();
          ctx.moveTo(i - this.crossSize, j);
          ctx.lineTo(i + this.crossSize, j);
          ctx.moveTo(i, j - this.crossSize);
          ctx.lineTo(i, j + this.crossSize);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  };

  Grid.prototype._drawCursor = function(ctx, camera) {
    var mousePos = this._getMousePosSnappedToGrid();
    ctx.strokeStyle = this.cursorColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mousePos.x - this.cursorSize / 2, mousePos.y);
    ctx.lineTo(mousePos.x + this.cursorSize / 2, mousePos.y);
    ctx.moveTo(mousePos.x, mousePos.y - this.cursorSize / 2);
    ctx.lineTo(mousePos.x, mousePos.y + this.cursorSize / 2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  Grid.prototype._displayCoordinates = function(ctx, camera) {
    var unapplyCam = camera.unapplyCamera.bind(camera);
    var mousePos = this._getMousePosSnappedToGrid();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#ccc";
    var mouseGamePos = unapplyCam(mousePos.x, mousePos.y);
    ctx.fillText(
      mouseGamePos.x + ", " + mouseGamePos.y,
      mousePos.x + 20,
      mousePos.y - 20
    );
  };

  Grid.prototype.draw = function(ctx, camera) {
    this.context.rulers && this._drawRulers(ctx, camera);
    this._drawInnerGrid(ctx, camera);
    this._drawPrecisionArea(ctx, camera);
    this._drawCursor(ctx, camera);
    this._displayCoordinates(ctx, camera);
  };

  return Grid;
})();
