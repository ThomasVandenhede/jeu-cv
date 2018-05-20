var Grid = (function () {
  function Grid(context) {
    this.context = context;
    this.canvas = this.context.canvas;
    this.camera = this.context.camera;
    this.mouse = this.context.mouse;

    // grid config
    this.crossSize = 3;
    this.cursorSize = 10;
    this.cursorColor = "white";
    this.precision = 10;
    this.precisionAreaSize = 100;
    this.isPrecisionAreaRound = true; // otherwise square
  }

  Grid.prototype._getMouseXYSnappedToGrid = function () {
    var that = this;
    return {
      x: Math.round((that.camera.x + that.mouse.x) / that.precision) * that.precision,
      y: Math.round((that.camera.y + that.mouse.y) / that.precision) * that.precision
    };
  };

  Grid.prototype._drawRulers = function (ctx) {
    var minX = Math.floor(this.camera.x / 100, 2) * 100;
    var maxX = Math.ceil((this.camera.x + this.camera.wView) / 100, 2) * 100;
    var minY = Math.floor(this.camera.y / 100, 2) * 100;
    var maxY = Math.ceil((this.camera.y + this.camera.hView) / 100, 2) * 100;

    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#ffd700"; // Star Wars yellow
    ctx.strokeStyle = "white";
    for (var i = minX; i <= maxX; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i - this.camera.x, 0);
      ctx.lineTo(i - this.camera.x, 10);
      ctx.stroke();
      ctx.moveTo(i - this.camera.x, this.canvas.height - 10);
      ctx.lineTo(i - this.camera.x, this.canvas.height);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(i, i + 10 - this.camera.x, 20);
      ctx.fillText(i, i + 10 - this.camera.x, this.canvas.height - 10);
    }
    for (var i = minY; i <= maxY; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i - this.camera.y);
      ctx.lineTo(10, i - this.camera.y);
      ctx.stroke();
      ctx.moveTo(this.canvas.width - 10, i - this.camera.y);
      ctx.lineTo(this.canvas.width, i - this.camera.y);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(-i, 20, i - this.camera.y);
      ctx.fillText(-i, this.canvas.width - 50, i - this.camera.y);
    }
  };

  Grid.prototype._displayCoordinates = function (ctx) {
    var mouseXY = this._getMouseXYSnappedToGrid();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#ccc";
    ctx.fillText(mouseXY.x + ", " + mouseXY.y, mouseXY.x + 20 - this.camera.x, mouseXY.y - 20 - this.camera.y);
  };

  Grid.prototype._drawInnerGrid = function (ctx) {
    var minX = Math.floor(this.camera.x / 100, 2) * 100;
    var maxX = Math.ceil((this.camera.x + this.camera.wView) / 100, 2) * 100;
    var minY = Math.floor(this.camera.y / 100, 2) * 100;
    var maxY = Math.ceil((this.camera.y + this.camera.hView) / 100, 2) * 100;

    for (var i = minX; i <= maxX; i += 100) {
      for (var j = minY; j <= maxY; j += 100) {
        if (!(i % 100) && !(j % 100)) {
          ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        }
        ctx.beginPath();
        ctx.moveTo(i - this.crossSize - this.camera.x, j - this.camera.y);
        ctx.lineTo(i + this.crossSize - this.camera.x, j - this.camera.y);
        ctx.moveTo(i - this.camera.x, j - this.crossSize - this.camera.y);
        ctx.lineTo(i - this.camera.x, j + this.crossSize - this.camera.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  Grid.prototype._drawPrecisionArea = function (ctx) {
    var mouseXY = this._getMouseXYSnappedToGrid();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    for (var i = mouseXY.x - this.precisionAreaSize / 2; i <= mouseXY.x + this.precisionAreaSize / 2; i += this.precision) {
      for (var j = mouseXY.y - this.precisionAreaSize / 2; j <= mouseXY.y + this.precisionAreaSize / 2; j += this.precision) {
        if (!this.isPrecisionAreaRound || Math.pow(i - mouseXY.x, 2) + Math.pow(j - mouseXY.y, 2) <= Math.pow(this.precisionAreaSize / 2, 2)) {
          ctx.beginPath();
          ctx.moveTo(i - this.crossSize - this.camera.x, j - this.camera.y);
          ctx.lineTo(i + this.crossSize - this.camera.x, j - this.camera.y);
          ctx.moveTo(i - this.camera.x, j - this.crossSize - this.camera.y);
          ctx.lineTo(i - this.camera.x, j + this.crossSize - this.camera.y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  };

  Grid.prototype._drawCursor = function (ctx) {
    var mouseXY = this._getMouseXYSnappedToGrid();
    ctx.strokeStyle = this.cursorColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouseXY.x - this.cursorSize / 2 - this.camera.x, mouseXY.y - this.camera.y);
    ctx.lineTo(mouseXY.x + this.cursorSize / 2 - this.camera.x, mouseXY.y - this.camera.y);
    ctx.moveTo(mouseXY.x - this.camera.x, mouseXY.y - this.cursorSize / 2 - this.camera.y);
    ctx.lineTo(mouseXY.x - this.camera.x, mouseXY.y + this.cursorSize / 2 - this.camera.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  Grid.prototype.draw = function (ctx) {
    this.context.rulers && this._drawRulers(ctx);
    this._drawInnerGrid(ctx);
    this._drawPrecisionArea(ctx);
    this._drawCursor(ctx);
    this._displayCoordinates(ctx);
  };

  return Grid;
})();