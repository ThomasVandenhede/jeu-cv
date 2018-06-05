var SelectionContext = (function() {
  function SelectionContext() {}

  SelectionContext.prototype.getContext = function() {
    context.id = 0;
    context.mouse = {
      mousedown: {
        handler: handleMouseDown,
        options: undefined
      },
      mouseup: {
        handler: handleMouseUp,
        options: undefined
      },
      mousemove: {
        handler: handleMouseMove,
        options: undefined
      },
      wheel: {
        handler: function() {},
        options: { passive: true }
      }
    };
    return context;
  };

  var context = {};
  /**
   * event handlers
   **/
  function handleMouseDown(e) {
    var camera = this.app.camera;
    var clickX = e.clientX + this.canvas.offsetLeft;
    var clickY = e.clientY + this.canvas.offsetTop;
    this.buttons[e.button] = true;
    var mousePos = this.app.grid._getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    var mouseGamePos = camera.unapply(mousePos.x, mousePos.y);

    switch (e.button) {
      case 0:
        var gameObjects = this.app.gameObjects;
        var clickedObject = null;
        var selectedObjects = [];
        var selectedObjectsStartingPositions = [];

        // find the most recently added game object the click was inside of
        gameObjects.forEach(function(gameObject) {
          // if some game object is clicked and object doesn't belong to selection
          if (gameObject.contains(mouseGamePos.x, mouseGamePos.y)) {
            clickedObject = gameObject;
            selectedObjects = [clickedObject];
            selectedObjectsStartingPositions = [
              new Vector(gameObject.x, gameObject.y)
            ]; // store starting position in order to move the object with the mouse
          }
        });

        // check if selected object already belongs to a selection
        if (
          this.selectedObjects &&
          this.selectedObjects.includes(selectedObjects[0])
        ) {
          selectedObjects = this.selectedObjects;
          selectedObjectsStartingPositions = this
            .selectedObjectsStartingPositions;
        }

        this.clickedObject = clickedObject;
        console.log(this.clickedObject);
        this.selectedObjects = selectedObjects;
        this.selectedObjectsStartingPositions = selectedObjectsStartingPositions;
        if (!selectedObjects.length) {
          this.selectionArea = new AABB(mouseGamePos.x, mouseGamePos.y);
        }
        break;
      default:
        break;
    }

    this.clickX = clickX;
    this.clickY = clickY;
  }

  function handleMouseUp(e) {
    var releaseX = e.clientX + this.canvas.offsetLeft;
    var releaseY = e.clientY + this.canvas.offsetTop;
    this.buttons[e.button] = false;
    switch (e.button) {
      case 0:
        // left mouse button
        var gameObjects = this.app.gameObjects;
        if (this.selectedObjects && this.selectedObjects.length) {
          // update starting positions
          this.selectedObjectsStartingPositions = this.selectedObjects.map(
            function(obj) {
              return new Vector(obj.x, obj.y);
            }
          );

          // If click and release at the same spot, select the most recently added game object the click was inside of
          if (releaseX === this.clickX && releaseY === this.clickY) {
            this.selectedObjects = [this.clickedObject];
            this.selectedObjectsStartingPositions = [
              new Vector(this.clickedObject.x, this.clickedObject.y)
            ];
          }
        } else {
          this.selectedObjects = [];
          this.selectedObjectsStartingPositions = [];
          gameObjects.forEach(function(gameObject) {
            if (gameObject.overlaps(this.selectionArea)) {
              this.selectedObjects.push(gameObject);
              this.selectedObjectsStartingPositions.push(
                new Vector(gameObject.x, gameObject.y)
              );
            }
          });
          delete this.selectionArea;
        }
        break;
      default:
        break;
    }

    this.releaseX = releaseX;
    this.releaseY = releaseY;
  }

  function handleMouseMove(e) {
    var camera = this.app.camera;
    var unapplyCam = camera.unapply.bind(camera);
    var clickPos = this.app.grid._getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    var clickGamePos = unapplyCam(clickPos.x, clickPos.y);
    var mousePos = this.app.grid._getMousePosSnappedToGrid.call(
      this.app.grid,
      this.x,
      this.y
    );
    var mouseGamePos = unapplyCam(mousePos.x, mousePos.y);
    var mouseGameDisplacement = Vector.subtract(mouseGamePos, clickGamePos);

    // move camera when mouse wheel is held down
    if (this.buttons[0]) {
      if (this.selectionArea) {
        this.selectionArea.width = mouseGameDisplacement.x;
        this.selectionArea.height = mouseGameDisplacement.y;
      } else {
        var selectedObjects = this.selectedObjects;
        selectedObjects.forEach(function(selectedObject) {
          selectedObject.x =
            this.selectedObjectsStartingPositions[i].x +
            mouseGameDisplacement.x;
          selectedObject.y =
            this.selectedObjectsStartingPositions[i].y +
            mouseGameDisplacement.y;
        });
      }
    }
  }

  /**
   * context object construction
   **/
  context.id = 0;
  context.mouse = {
    mousedown: {
      handler: handleMouseDown,
      options: undefined
    },
    mouseup: {
      handler: handleMouseUp,
      options: undefined
    },
    mousemove: {
      handler: handleMouseMove,
      options: undefined
    },
    wheel: {
      handler: function() {},
      options: { passive: true }
    }
  };

  return SelectionContext;
})();
