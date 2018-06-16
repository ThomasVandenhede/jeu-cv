var SelectionTool = (function() {
  function SelectionTool(props) {
    this.gameObjects = props.gameObjects;
    this.camera = props.camera;
    this.mouse = props.mouse;
    this.grid = props.grid;
    this.canvas = props.canvas;

    this.selection = [];
    this.clickedObject = null;
    this.selectionArea = null;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.eventHandlers = {
      mouse: {
        mousedown: {
          handler: this.handleMouseDown,
          props: undefined
        },
        mouseup: {
          handler: this.handleMouseUp,
          props: undefined
        },
        mousemove: {
          handler: this.handleMouseMove,
          props: undefined
        }
      }
    };
  }

  SelectionTool.prototype.getSelectionBoundingRect = function() {
    var selectedObjects = this.selection.map(function(item) {
      return item.object;
    });
    var left = Math.min.apply(
      null,
      selectedObjects.map(function(obj) {
        return obj.getBoundingRect().left;
      })
    );
    var top = Math.min.apply(
      null,
      selectedObjects.map(function(obj) {
        return obj.getBoundingRect().top;
      })
    );
    var width =
      Math.max.apply(
        null,
        selectedObjects.map(function(obj) {
          return obj.getBoundingRect().right;
        })
      ) - left;
    var height =
      Math.max.apply(
        null,
        selectedObjects.map(function(obj) {
          return obj.getBoundingRect().bottom;
        })
      ) - top;
    return new AABB({ x: left, y: top, width: width, height: height });
  };

  SelectionTool.prototype.handleMouseDown = function handleMouseDown(e) {
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var newSelection = [];

    switch (e.button) {
      case 0:
        // check if the player clicked a resize handle
        this.resizeHandleClicked = this.isMouseInsideResizeHandle();
        if (this.resizeHandleClicked) return;

        // find the most recently added game object the click was inside of
        this.clickedObject = this.getClickedObject(
          mouseGamePosSnappedToGrid.x,
          mouseGamePosSnappedToGrid.y
        );

        if (this.clickedObject) {
          newSelection = [
            {
              object: this.clickedObject,
              objectStart: Object.assign({}, this.clickedObject) // copy
            }
          ];
        }

        // check if clicked object already belongs to a previous selection
        var selectionObjects = this.selection.map(function(item) {
          return item.object;
        });
        if (
          this.clickedObject &&
          selectionObjects.includes(this.clickedObject)
        ) {
          newSelection = this.selection;
        }

        this.selection = newSelection;

        // create selection area if no object was selected
        if (!this.clickedObject) {
          this.selectionArea = new AABB({
            x: mouseGamePosSnappedToGrid.x,
            y: mouseGamePosSnappedToGrid.y
          });
        }
        break;
      case 2:
        var clickedObject = this.getClickedObject(
          mouseGamePosSnappedToGrid.x,
          mouseGamePosSnappedToGrid.y
        );
        if (
          clickedObject &&
          clickedObject.constructor.name === "MovingPlatform"
        ) {
          this.clickedObject = clickedObject;
        }
        break;
      default:
        break;
    }
  };

  SelectionTool.prototype.isMouseInsideResizeHandle = function() {
    if (this.selection) {
      var selectionRectangle = this.getSelectionBoundingRect();
      var resizeHandlePos = this.camera.apply(
        selectionRectangle.right,
        selectionRectangle.bottom
      );
      var resizeHandleRectangle = new AABB({
        x: resizeHandlePos.x,
        y: resizeHandlePos.y,
        width: 20,
        height: 20
      });

      return resizeHandleRectangle.contains(this.mouse.x, this.mouse.y);
    }
  };

  SelectionTool.prototype.getClickedObject = function(x, y) {
    var clickedObject = null;
    for (var i = 0; i < this.gameObjects.length; i++) {
      var gameObject = this.gameObjects[i];
      if (gameObject.contains(x, y)) {
        clickedObject = gameObject;
      }
    }
    return clickedObject;
  };

  SelectionTool.prototype.handleMouseMove = function handleMouseMove(e) {
    var clickGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.clickX,
      this.mouse.clickY
    );
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var mouseGameDisplacement = Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );
    // no button down and mouse is inside a resize handle
    if (
      !this.mouse.buttons[0] &&
      !this.mouse.buttons[1] &&
      !this.mouse.buttons[2]
    ) {
      this.resizeHandleHovered = this.isMouseInsideResizeHandle();
      return;
    }
    // left button down
    if (this.mouse.buttons[0]) {
      // resize selection objects if resize handle was clicked
      if (this.resizeHandleClicked) {
        this.resizeSelectedObjects(
          mouseGameDisplacement.x,
          mouseGameDisplacement.y
        );
        return;
      }
      if (this.selectionArea) {
        this.selectionArea.width = mouseGameDisplacement.x;
        this.selectionArea.height = mouseGameDisplacement.y;
      } else {
        this.moveSelectedObjects(
          mouseGameDisplacement.x,
          mouseGameDisplacement.y
        );
      }
    }
    // right button down
    if (this.mouse.buttons[2]) {
      if (this.clickedObject) {
        this.clickedObject.xEnd =
          this.clickedObject.xStart + mouseGameDisplacement.x;
        this.clickedObject.yEnd =
          this.clickedObject.yStart + mouseGameDisplacement.y;
      }
    }
  };

  SelectionTool.prototype.resizeSelectedObjects = function(dx, dy) {
    this.selection.forEach(function(item) {
      item.object.width = item.objectStart.width + dx;
      item.object.height = item.objectStart.height + dy;
    });
  };

  SelectionTool.prototype.moveSelectedObjects = function(dx, dy) {
    this.selection.forEach(function(item) {
      item.object.x = item.objectStart.x + dx;
      item.object.y = item.objectStart.y + dy;
      item.object.xStart = item.objectStart.xStart + dx;
      item.object.yStart = item.objectStart.yStart + dy;
      item.object.xEnd = item.objectStart.xEnd + dx;
      item.object.yEnd = item.objectStart.yEnd + dy;
    });
  };

  SelectionTool.prototype.handleMouseUp = function handleMouseUp(e) {
    switch (e.button) {
      case 0: // left button up
        if (this.resizeHandleClicked) {
          this.resizeHandleClicked = false; // release handle
          this.selection.forEach(function(item) {
            item.objectStart.width = item.object.width;
            item.objectStart.height = item.object.height;
          });
          return;
        }

        if (this.selection.length) {
          if (
            this.mouse.releaseX === this.mouse.clickX &&
            this.mouse.releaseY === this.mouse.clickY
          ) {
            // If click and release at the same spot, select the most recently added game object the click was inside of
            this.selection = [
              {
                object: this.clickedObject
              }
            ];
          }

          this.selection.forEach(function(item) {
            item.objectStart = Object.assign({}, item.object);
          });

          return;
        }

        if (this.selectionArea) {
          // which objects are in the selection area?
          this.selection = [];
          this.gameObjects.forEach(
            function(obj) {
              if (obj.overlaps(this.selectionArea)) {
                this.selection.push({
                  object: obj,
                  objectStart: Object.assign({}, obj)
                });
              }
            }.bind(this)
          );
          this.selectionArea = null;
        }
        break;
      case 2:
        if (this.selection.length && this.clickedObject) {
          this.selection[0].objectStart.xEnd = this.clickedObject.xEnd;
          this.selection[0].objectStart.yEnd = this.clickedObject.yEnd;
        }
        this.clickedObject = null;
        break;
      default:
        break;
    }
  };

  return SelectionTool;
})();
