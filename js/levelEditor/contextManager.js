var contextManager = (function() {
  var instance = null;

  var contextID = 0; // context

  // map of all contexts to their ID
  var allContexts = {
    0: "select",
    1: "create"
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
    var gameObjects = this.app.gameObjects;
    var clickedObject = null;
    var selectedObjects = [];
    var selectedObjectsStart = [];

    switch (e.button) {
      case 0:
        // find the most recently added game object the click was inside of
        for (var i = 0; i < gameObjects.length; i++) {
          var gameObject = gameObjects[i];
          // if some game object is clicked and object doesn't belong to selection
          if (gameObject.contains(mouseGamePos.x, mouseGamePos.y)) {
            clickedObject = gameObject;
            selectedObjects = [clickedObject];
            selectedObjectsStart = [new Vector(gameObject.x, gameObject.y)]; // store starting position in order to move the object with the mouse
          }
        }
        // check if selected object already belongs to a selection
        if (
          this.selectedObjects &&
          this.selectedObjects.includes(selectedObjects[0])
        ) {
          selectedObjects = this.selectedObjects;
          selectedObjectsStart = this.selectedObjectsStart;
        }

        this.clickedObject = clickedObject;
        this.selectedObjects = selectedObjects;
        this.selectedObjectsStart = selectedObjectsStart;
        // console.log(this.selectedObjects);
        if (!selectedObjects.length) {
          this.selectionArea = new AABB({
            x: mouseGamePos.x,
            y: mouseGamePos.y
          });
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
          this.selectedObjectsStart = this.selectedObjects.map(function(obj) {
            return new Vector(obj.x, obj.y);
          });

          // If click and release at the same spot, select the most recently added game object the click was inside of
          if (releaseX === this.clickX && releaseY === this.clickY) {
            this.selectedObjects = [this.clickedObject];
            this.selectedObjectsStart = [
              new Vector(this.clickedObject.x, this.clickedObject.y)
            ];
          }
        } else {
          this.selectedObjects = [];
          this.selectedObjectsStart = [];
          for (var i = 0; i < gameObjects.length; i++) {
            var gameObject = gameObjects[i];
            if (gameObject.overlaps(this.selectionArea)) {
              this.selectedObjects.push(gameObject);
              this.selectedObjectsStart.push(
                new Vector(gameObject.x, gameObject.y)
              );
            }
          }
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
    var clickPos = this.app.grid.getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    var clickGamePos = unapplyCam(clickPos.x, clickPos.y);
    var mousePos = this.app.grid.getMousePosSnappedToGrid.call(
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
        for (var i = 0; i < selectedObjects.length; i++) {
          var selectedObject = selectedObjects[i];
          selectedObject.x =
            this.selectedObjectsStart[i].x + mouseGameDisplacement.x;
          selectedObject.y =
            this.selectedObjectsStart[i].y + mouseGameDisplacement.y;

          if (selectedObject.constructor.name === "MovingPlatform") {
            selectedObject.xStart =
              this.selectedObjectsStart[i].x + mouseGameDisplacement.x;
            selectedObject.yStart =
              this.selectedObjectsStart[i].y + mouseGameDisplacement.y;
            selectedObject.xEnd =
              this.selectedObjectsStart[i].xEnd + mouseGameDisplacement.x;
            selectedObject.yEnd =
              this.selectedObjectsStart[i].yEnd + mouseGameDisplacement.y;
          }
        }
      }
    }
    if (this.buttons[2]) {
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
    var mouseGamePos = camera.unapply(mousePos.x, mousePos.y);
    var gameObjects = this.app.gameObjects;
    var clickedObject = null;
    var selectedObjects = [];
    var selectedObjectsStart = [];

    switch (e.button) {
      case 0:
        // left mouse button
        var Constructor = this.app.gameObjectConstructor;
        var gameObject = new Constructor({
          x: mouseGamePos.x,
          y: mouseGamePos.y
        });
        this.app.gameObjects.push(gameObject);
        switch (Constructor.name) {
          case "Platform":
          case "MovingPlatform":
            this.currentObject = gameObject;
            console.log(
              "​contextManager -> this.currentObject",
              this.currentObject
            );
            break;
          default:
            this.currentObject = null;
            break;
        }
      case 2:
        // find the most recently added game object the click was inside of
        var movingPlatforms = gameObjects.filter(function(gameObject) {
          return gameObject.constructor.name === "MovingPlatform";
        });
        movingPlatforms.forEach(function(platform) {
          // if some game object is clicked and object doesn't belong to selection
          if (platform.contains(mouseGamePos.x, mouseGamePos.y)) {
            this.clickedObject = gameObject;
          }
        });
        if (this.clickedObject) {
          selectedObjectsStart[0].xStart = this.clickedObject.xStart;
          selectedObjectsStart[0].yStart = this.clickedObject.yStart;
          selectedObjectsStart[0].xEnd = this.clickedObject.xEnd;
          selectedObjectsStart[0].yEnd = this.clickedObject.yEnd;
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
        // this.grabbed = null;
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "";
        this.grabbed = null;
        break;
      case 2:
        // right mouse button
        // this.grabbed = null;
        break;
      default:
        break;
    }
  }

  function handleMouseMove1(e) {
    var camera = this.app.camera;
    var unapplyCam = camera.unapply.bind(camera);
    var clickPos = this.app.grid.getMousePosSnappedToGrid.call(
      this.app.grid,
      this.clickX,
      this.clickY
    );
    var clickGamePos = unapplyCam(clickPos.x, clickPos.y);
    var mousePos = this.app.grid.getMousePosSnappedToGrid.call(
      this.app.grid,
      this.x,
      this.y
    );
    var mouseGamePos = unapplyCam(mousePos.x, mousePos.y);
    var mouseGameDisplacement = Vector.subtract(mouseGamePos, clickGamePos);

    // move camera when mouse wheel is held down
    if (this.buttons[0]) {
      console.log(this.currentObject);
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

  function ContextManager() {}

  Object.defineProperties(ContextManager.prototype, {
    context: {
      set: function(id) {
        console.log(id);
        if (id !== contextID) {
          this.unsetEventHandlersForContext(contextID);
          this.setEventHandlersForContext(id);
          contextID = id;
        }
      }
    }
  });

  ContextManager.prototype.init = function(app) {
    this.app = app;
    this.setGenericEventHandlers();
    this.setEventHandlersForContext(contextID);
  };

  ContextManager.prototype.setGenericEventHandlers = function() {
    this.setEventHandlersForContext("generic");
  };

  ContextManager.prototype.unsetEventHandlersForContext = function(id) {
    var app = this.app;
    var entries = Object.entries(contextEventHandlers[id].mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      app.mouse.off(app.canvas, key, value.handler, value.props);
    }
  };

  ContextManager.prototype.setEventHandlersForContext = function(id) {
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
        instance = new ContextManager();
      }
      return instance;
    }
  };
})();
