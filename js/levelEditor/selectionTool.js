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

  SelectionTool.prototype.handleMouseDown = function handleMouseDown(e) {
    var mouseGamePosSnappedToGrid = this.grid.getGameMousePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var newSelection = [];

    switch (e.button) {
      case 0:
        // check if the player clicked a resize handle?
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
              objectStart: Object.assign({}, this.clickedObject)
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

        console.log(
          "​handleMouseDown -> this.clickedObject",
          this.clickedObject
        );

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

  SelectionTool.prototype.handleMouseUp = function handleMouseUp(e) {
    switch (e.button) {
      case 0:
        // selection resize handle is selected
        if (this.resizeHandleClicked) {
          this.resizeHandleClicked = false;
          this.selection.forEach(function(item) {
            item.objectStart.width = item.object.width;
            item.objectStart.height = item.object.height;
          });
          return;
        }

        if (this.selection.length) {
          if (
            this.releaseX === this.mouse.clickX &&
            this.releaseY === this.mouse.clickY
          ) {
            // If click and release at the same spot, select the most recently added game object the click was inside of
            this.selection = [
              {
                object: this.clickedObject,
                objectStart: Object.assign({}, this.clickedObject)
              }
            ];
          } else {
            // update starting positions
            this.selection.forEach(function(item) {
              item.objectStart = Object.assign({}, item.object);
            });
          }
        } else {
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
      default:
        break;
    }
  };

  SelectionTool.prototype.handleMouseMove = function handleMouseMove(e) {
    var clickGamePosSnappedToGrid = this.grid.getGameMousePosSnappedToGrid(
      this.mouse.clickX,
      this.mouse.clickY
    );
    var mouseGamePosSnappedToGrid = this.grid.getGameMousePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var mouseGameDisplacement = Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );

    if (
      !this.mouse.buttons[0] &&
      !this.mouse.buttons[1] &&
      !this.mouse.buttons[2]
    ) {
      this.resizeHandleHovered = this.isMouseInsideResizeHandle();
    }
    if (this.mouse.buttons[0]) {
      // resize selection objects if resize handle was clicked
      if (this.resizeHandleClicked) {
        this.selection.forEach(function(item) {
          item.object.width = item.objectStart.width + mouseGameDisplacement.x;
          item.object.height =
            item.objectStart.height + mouseGameDisplacement.y;
        });
        return;
      }

      if (this.selectionArea) {
        this.selectionArea.width = mouseGameDisplacement.x;
        this.selectionArea.height = mouseGameDisplacement.y;
      } else {
        this.selection.forEach(
          function(item) {
            item.object.x = item.objectStart.x + mouseGameDisplacement.x;
            item.object.y = item.objectStart.y + mouseGameDisplacement.y;
            item.object.xStart =
              item.objectStart.xStart + mouseGameDisplacement.x;
            item.object.yStart =
              item.objectStart.yStart + mouseGameDisplacement.y;
            item.object.xEnd = item.objectStart.xEnd + mouseGameDisplacement.x;
            item.object.yEnd = item.objectStart.yEnd + mouseGameDisplacement.y;
          }.bind(this)
        );
      }
    } else if (this.mouse.buttons[2]) {
      this.clickedObject.xEnd =
        this.clickedObject.xStart + mouseGameDisplacement.x;
      this.clickedObject.yEnd =
        this.clickedObject.yStart + mouseGameDisplacement.y;
    }
  };

  return SelectionTool;
})();
