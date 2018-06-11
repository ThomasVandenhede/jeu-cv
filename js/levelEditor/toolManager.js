var toolManager = (function() {
  var instance = null;

  var toolID = 0; // context

  // map of all contexts to their ID
  var allTools = {
    0: "select",
    1: "create"
  };

  var defaultOptions = {
    Platform: {
      passthrough: false
    },
    MovingPlatform: {
      passthrough: false,
      positionRatio: 0
    }
  };

  // DEFAULT EVENT HANDLERS
  // Generic event handlers are NEVER detached,
  // they are the common behavior for all contexts.
  function handleMouseDownGeneric(e) {
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
  }

  function handleMouseUpGeneric(e) {
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
  }

  function handleMouseMoveGeneric(e) {
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
  }

  function handleWheelGeneric(e) {
    var grid = this.app.grid;
    var camera = this.app.camera;
    var zoomingRatePerScroll = 1.2;
    var unapplyCamera = camera.unapply.bind(camera);
    var deltaY = e.deltaY;
    var mouseX = e.clientX + this.canvas.offsetLeft;
    var mouseY = e.clientY + this.canvas.offsetTop;
    var mouseGamePos = unapplyCamera(mouseX, mouseY);
    var snappedMouseGamePos = new Vector(
      Math.round(mouseGamePos.x / 10) * 10,
      Math.round(mouseGamePos.y / 10) * 10
    );

    if (deltaY > 0) {
      camera.zoomLevel /= zoomingRatePerScroll;
      if (camera.zoomLevel < 0.02) {
        camera.zoomLevel = 0.02;
      } else {
        camera.x =
          (camera.x - mouseGamePos.x) * zoomingRatePerScroll + mouseGamePos.x;
        camera.y =
          (camera.y - mouseGamePos.y) * zoomingRatePerScroll + mouseGamePos.y;
      }
    } else {
      camera.zoomLevel *= zoomingRatePerScroll;
      if (camera.zoomLevel > 8) {
        camera.zoomLevel = 8;
      } else {
        camera.x =
          (camera.x - mouseGamePos.x) / zoomingRatePerScroll + mouseGamePos.x;
        camera.y =
          (camera.y - mouseGamePos.y) / zoomingRatePerScroll + mouseGamePos.y;
      }
    }
  }

  // SELECTION EVENT HANDLERS
  function handleMouseDown(e) {
    var camera = this.app.camera;
    var clickX = e.clientX + this.canvas.offsetLeft;
    var clickY = e.clientY + this.canvas.offsetTop;
    this.buttons[e.button] = true;
    var mousePos = this.app.grid.getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    var mouseGamePos = camera.unapply(mousePos.x, mousePos.y);

    var mouseGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.x,
      this.y
    );

    var gameObjects = this.app.gameObjects;
    var clickedObject = null;
    var newSelection = [];

    switch (e.button) {
      case 0:
        // Did the player click a resize handle?
        if (this.selection) {
          var selectionRectangle = this.app.getSelectionBoundingRect();
          var resizeHandlePos = camera.apply(
            selectionRectangle.right,
            selectionRectangle.bottom
          );
          var resizeHandleRectangle = new AABB({
            x: resizeHandlePos.x,
            y: resizeHandlePos.y,
            width: 20,
            height: 20
          });
          if (resizeHandleRectangle.contains(this.clickX, this.clickY)) {
            this.resizeHandleClicked = true;
            return;
          } else {
            this.resizeHandleClicked = false;
          }
        }

        // find the most recently added game object the click was inside of
        for (var i = 0; i < gameObjects.length; i++) {
          var gameObject = gameObjects[i];
          // if some game object is clicked and object doesn't belong to selection
          if (gameObject.contains(mouseGamePos.x, mouseGamePos.y)) {
            clickedObject = gameObject;
            newSelection = [
              {
                object: clickedObject,
                startingRect: new AABB({
                  x: gameObject.x,
                  y: gameObject.y,
                  width: gameObject.width,
                  height: gameObject.height
                })
              }
            ];
            if (newSelection[0].object.constructor.name === "MovingPlatform") {
              newSelection[0].startingRect.xEnd = clickedObject.xEnd;
              newSelection[0].startingRect.yEnd = clickedObject.yEnd;
            }
          }
        }

        // check if selected object already belongs to a previous selection
        var selectionObjects = this.selection.map(function(item) {
          return item.object;
        });
        if (
          newSelection.length &&
          selectionObjects.includes(newSelection[0].object)
        ) {
          newSelection = this.selection;
        }

        this.clickedObject = clickedObject;
        this.selection = newSelection;
        if (!this.selection.length) {
          this.selectionArea = new AABB({
            x: mouseGamePos.x,
            y: mouseGamePos.y
          });
        }
        break;
      case 2:
        // find the most recently added game object the click was inside of
        var movingPlatforms = gameObjects.filter(function(obj) {
          return obj.constructor.name === "MovingPlatform";
        });
        movingPlatforms.forEach(
          function(platform) {
            // if a moving platform was right clicked
            if (
              platform.contains(
                mouseGamePosSnappedToGrid.x,
                mouseGamePosSnappedToGrid.y
              )
            ) {
              this.clickedObject = platform;
            }
          }.bind(this)
        );
        console.log(this.clickedObject);
        if (this.clickedObject) {
          this.clickedObject.xStart = this.clickedObject.x;
          this.clickedObject.yStart = this.clickedObject.y;
          this.clickedObject.xEnd = this.clickedObject.xEnd;
          this.clickedObject.yEnd = this.clickedObject.yEnd;
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
        // selection resize handle is selected
        if (this.resizeHandleClicked) {
          this.resizeHandleClicked = false;
          this.selection.forEach(function(item) {
            item.startingRect.width = item.object.width;
            item.startingRect.height = item.object.height;
          });
          return;
        }

        if (this.selection.length) {
          if (releaseX === this.clickX && releaseY === this.clickY) {
            // If click and release at the same spot, select the most recently added game object the click was inside of
            var obj = this.clickedObject;
            this.selection = [
              {
                object: obj,
                startingRect: new AABB({
                  x: obj.x,
                  y: obj.y,
                  width: obj.width,
                  height: obj.height
                })
              }
            ];
          } else {
            // update starting positions
            this.selection.forEach(function(item) {
              item.startingRect = new AABB({
                x: item.object.x,
                y: item.object.y,
                width: item.object.width,
                height: item.object.height
              });
            });
          }
        } else {
          // which objects are in the selection area?
          this.selection = [];
          this.app.gameObjects.forEach(
            function(obj) {
              if (obj.overlaps(this.selectionArea)) {
                this.selection.push({
                  object: obj,
                  startingRect: new AABB({
                    x: obj.x,
                    y: obj.y,
                    width: obj.width,
                    height: obj.height
                  })
                });
              }
            }.bind(this)
          );
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
    var clickGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.clickX,
      this.clickY
    );
    var mouseGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.x,
      this.y
    );
    var mouseGameDisplacement = Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );

    if (this.buttons[0]) {
      // resize selection objects if resize handle was clicked
      if (this.resizeHandleClicked) {
        this.selection.forEach(function(item) {
          item.object.width = item.startingRect.width + mouseGameDisplacement.x;
          item.object.height =
            item.startingRect.height + mouseGameDisplacement.y;
        });
        return;
      }

      if (this.selectionArea) {
        this.selectionArea.width = mouseGameDisplacement.x;
        this.selectionArea.height = mouseGameDisplacement.y;
      } else {
        var selection = this.selection;
        selection.forEach(
          function(item) {
            item.object.x = item.startingRect.x + mouseGameDisplacement.x;
            item.object.y = item.startingRect.y + mouseGameDisplacement.y;

            // special case for Moving Platform
            if (item.object.constructor.name === "MovingPlatform") {
              item.object.xStart =
                item.startingRect.x + mouseGameDisplacement.x;
              item.object.yStart =
                item.startingRect.y + mouseGameDisplacement.y;
              item.object.xEnd =
                item.startingRect.xEnd + mouseGameDisplacement.x;
              item.object.yEnd =
                item.startingRect.yEnd + mouseGameDisplacement.y;
            }
          }.bind(this)
        );
      }
    } else if (this.buttons[2]) {
      if (this.clickedObject) {
        switch (this.currentObject.constructor.name) {
          case "MovingPlatform":
            this.clickedObject.xEnd =
              this.clickedObject.xStart + mouseGameDisplacement.x;
            this.clickedObject.yEnd =
              this.clickedObject.yStart + mouseGameDisplacement.y;
            break;
          default:
            break;
        }
      }
    }
  }

  // PLAYER CREATION EVENT HANDLERS
  function handleMouseDown1(e) {
    var camera = this.app.camera;
    var clickX = e.clientX + this.canvas.offsetLeft;
    var clickY = e.clientY + this.canvas.offsetTop;
    this.buttons[e.button] = true;
    var mousePos = this.app.grid.getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    // var mouseGamePos = camera.unapply(mousePos.x, mousePos.y);
    var mouseGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.x,
      this.y
    );
    var gameObjects = this.app.gameObjects;
    var clickedObject = null;
    var selectedObjects = [];
    var selectedObjectsStart = [];

    switch (e.button) {
      case 0:
        // left mouse button
        var Constructor = this.app.gameObjectConstructor;
        var gameObject = new Constructor({
          x: mouseGamePosSnappedToGrid.x,
          y: mouseGamePosSnappedToGrid.y
        });
        for (
          var i = 0;
          i < Object.getOwnPropertyNames(gameObject).length;
          i++
        ) {
          var name = Object.getOwnPropertyNames(gameObject)[i];
        }
        this.app.gameObjects.push(gameObject);
        switch (Constructor.name) {
          case "Platform":
          case "MovingPlatform":
            this.currentObject = gameObject;
            break;
          default:
            this.currentObject = null;
            break;
        }
        break;
      default:
        break;
    }
  }

  function handleMouseUp1(e) {
    this.releaseX = e.clientX + this.canvas.offsetLeft;
    this.releaseY = e.clientY + this.canvas.offsetTop;
    this.buttons[e.button] = false;
    switch (e.button) {
      case 0:
        // left mouse button
        this.canvas.style.cursor = "";
        this.resizeHandleClicked = false;
        // this.grabbed = null;
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "";
        this.grabbed = null;
        break;
      case 2:
        // right mouse button
        this.clickedObject = null;
        break;
      default:
        break;
    }
  }

  function handleMouseMove1(e) {
    var clickGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.clickX,
      this.clickY
    );
    var mouseGamePosSnappedToGrid = this.app.grid.getGameMousePosSnappedToGrid(
      this.x,
      this.y
    );
    var mouseGameDisplacement = Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );

    // move camera when mouse wheel is held down
    if (this.buttons[0]) {
      if (this.currentObject) {
        this.currentObject.width = Math.max(0, mouseGameDisplacement.x);
        this.currentObject.height = Math.max(0, mouseGameDisplacement.y);
      }
    }
  }

  // use NAMED event handlers only
  var contextEventHandlers = {
    generic: {
      mouse: {
        mousedown: {
          handler: handleMouseDownGeneric,
          props: undefined
        },
        mouseup: {
          handler: handleMouseUpGeneric,
          props: undefined
        },
        mousemove: {
          handler: handleMouseMoveGeneric,
          props: undefined
        },
        wheel: {
          handler: handleWheelGeneric,
          props: { passive: true }
        }
      },
      keyboard: {}
    },
    0: {
      mouse: {
        mousedown: {
          handler: handleMouseDown,
          props: undefined
        },
        mouseup: {
          handler: handleMouseUp,
          props: undefined
        },
        mousemove: {
          handler: handleMouseMove,
          props: undefined
        },
        wheel: {
          handler: function() {},
          props: { passive: true }
        }
      },
      keyboard: {}
    },
    1: {
      mouse: {
        mousedown: {
          handler: handleMouseDown1,
          props: undefined
        },
        mouseup: {
          handler: handleMouseUp1,
          props: undefined
        },
        mousemove: {
          handler: handleMouseMove1,
          props: undefined
        },
        wheel: {
          handler: function() {},
          props: { passive: true }
        }
      },
      keyboard: {}
    }
  };

  function ToolManager() {}

  Object.defineProperties(ToolManager.prototype, {
    tool: {
      get: function() {
        return toolID;
      },
      set: function(id) {
        if (id !== toolID) {
          this.unsetEventHandlersForContext(toolID);
          this.setEventHandlersForContext(id);
          toolID = id;
        }
      }
    }
  });

  ToolManager.prototype.init = function(app) {
    this.app = app;
    this.setGenericEventHandlers();
    this.setEventHandlersForContext(toolID);
  };

  ToolManager.prototype.setGenericEventHandlers = function() {
    this.setEventHandlersForContext("generic");
  };

  ToolManager.prototype.unsetEventHandlersForContext = function(id) {
    var app = this.app;
    var entries = Object.entries(contextEventHandlers[id].mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      app.mouse.off(app.canvas, key, value.handler, value.props);
    }
  };

  ToolManager.prototype.setEventHandlersForContext = function(id) {
    var app = this.app;
    var entries = Object.entries(contextEventHandlers[id].mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      app.mouse.on(app.canvas, key, value.handler, value.props);
    }
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new ToolManager();
      }
      return instance;
    }
  };
})();
