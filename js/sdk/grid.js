var Grid = (function() {
  function Grid(props) {
    this.camera = props.camera;
    this.canvas = props.canvas;
    this.mouse = props.mouse;

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
    var applyCam = camera.apply.bind(camera);
    var unapplyCam = camera.unapply.bind(camera);
    var precisionGridSize = this.precisionGridSize;
    var mouse = this.mouse;

    var mouseGamePos = unapplyCam(mouse.x, mouse.y);
    var snappedMouseGamePos = new Vector(
      Math.round(mouseGamePos.x / precisionGridSize) * precisionGridSize,
      Math.round(mouseGamePos.y / precisionGridSize) * precisionGridSize
    );
    return applyCam(snappedMouseGamePos.x, snappedMouseGamePos.y);
  };

  Grid.prototype.getGameMousePosSnappedToGrid = function(mouseX, mouseY) {
    var camera = this.camera;
    var unapplyCam = camera.unapply.bind(camera);
    var mousePosSnappedToGrid = this.getMousePosSnappedToGrid(mouseX, mouseY);
    return unapplyCam(mousePosSnappedToGrid.x, mousePosSnappedToGrid.y);
  };

  Grid.prototype._drawRulers = function(ctx, camera) {
    var applyCam = camera.apply.bind(camera);
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
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
      ctx.moveTo.apply(ctx, applyCamToArr(i, camera.top));
      ctx.lineTo.apply(
        ctx,
        Object.values(Vector.sum(applyCam(i, camera.top), new Vector(0, 10)))
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(i, camera.bottom));
      ctx.lineTo.apply(
        ctx,
        Object.values(
          Vector.sum(applyCam(i, camera.bottom), new Vector(0, -10))
        )
      );
      ctx.stroke();
      if (i % (innerGridSize * 5) === 0) {
        ctx.fillText.apply(
          ctx,
          [i].concat(
            Object.values(
              Vector.sum(applyCam(i, camera.top), new Vector(10, 20))
            )
          )
        );
        ctx.fillText.apply(
          ctx,
          [i].concat(
            Object.values(
              Vector.sum(applyCam(i, camera.bottom), new Vector(10, -10))
            )
          )
        );
      }
    }
    for (var i = minY; i <= maxY; i += innerGridSize) {
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(camera.left, i));
      ctx.lineTo.apply(
        ctx,
        Object.values(Vector.sum(applyCam(camera.left, i), new Vector(10, 0)))
      );
      ctx.stroke();
      ctx.moveTo.apply(ctx, applyCamToArr(camera.right, i));
      ctx.lineTo.apply(
        ctx,
        Object.values(Vector.sum(applyCam(camera.right, i), new Vector(-10, 0)))
      );
      ctx.stroke();
      if (i % (innerGridSize * 5) === 0) {
        ctx.textAlign = "left";
        ctx.fillText.apply(
          ctx,
          [-i].concat(
            Object.values(
              Vector.sum(applyCam(camera.left, i), new Vector(10, -10))
            )
          )
        );
        ctx.textAlign = "right";
        ctx.fillText.apply(
          ctx,
          [-i].concat(
            Object.values(
              Vector.sum(applyCam(camera.right, i), new Vector(-10, -10))
            )
          )
        );
      }
    }
    ctx.restore();
  };

  Grid.prototype._drawInnerGrid = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
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
      ctx.moveTo.apply(ctx, applyCamToArr(i, camera.top));
      ctx.lineTo.apply(ctx, applyCamToArr(i, camera.bottom));
      ctx.stroke();
    }
    for (var j = minY; j <= maxY; j += innerGridSize) {
      if (j % (innerGridSize * 5) === 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      }
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(camera.left, j));
      ctx.lineTo.apply(ctx, applyCamToArr(camera.right, j));
      ctx.stroke();
    }
  };

  Grid.prototype._drawPrecisionArea = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var unapplyCam = camera.unapply.bind(camera);
    var mousePos = this.getMousePosSnappedToGrid();
    var precisionAreaGameSize = this.precisionAreaSize * camera.zoomLevel;
    var precisionGridSize = this.precisionGridSize * camera.zoomLevel;
    var minX = mousePos.x - precisionAreaGameSize / 2;
    var maxX = mousePos.x + precisionAreaGameSize / 2;
    var minY = mousePos.y - precisionAreaGameSize / 2;
    var maxY = mousePos.y + precisionAreaGameSize / 2;
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
    var mousePos = this.getMousePosSnappedToGrid();
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
    var unapplyCam = camera.unapply.bind(camera);
    var mousePos = this.getMousePosSnappedToGrid();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#ccc";
    var mouseGamePos = unapplyCam(mousePos.x, mousePos.y);
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

    options.shouldDisplayRulers && this._drawRulers(ctx, camera);
    !options.isGame && this._drawInnerGrid(ctx, camera);
    // this._drawPrecisionArea(ctx, camera);
    !options.isGame && this._drawCursor(ctx, camera);
    !options.isGame && this._displayCoordinates(ctx, camera);
    !options.isGame &&
      options.shouldDisplayRulers &&
      this._drawRulers(ctx, camera);
  };

  return Grid;
})();
