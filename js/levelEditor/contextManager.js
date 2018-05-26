var contextManager = (function() {
  var instance = null;

  var contextID = 0; // context

  // map of all contexts to their ID
  var allContexts = {
    0: "select",
    1: "create",
    3: "move"
  };

  function handleMouseDown(e) {
    this.clickX = e.clientX + this.canvas.offsetLeft;
    this.clickY = e.clientY + this.canvas.offsetTop;

    this.buttons[e.button] = true;
    switch (e.button) {
      case 0:
        // left mouse button
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "move";
        this.grabbed = this.app.camera;
        this.grabbedStartingX = this.grabbed.x;
        this.grabbedStartingY = this.grabbed.y;
        break;
      case 2:
        // right mouse button
        break;
      default:
        break;
    }
  }

  function handleMouseUp(e) {
    this.releaseX = e.clientX + this.canvas.offsetLeft;
    this.releaseY = e.clientY + this.canvas.offsetTop;
    switch (e.button) {
      case 0:
        // left mouse button
        this.canvas.style.cursor = "";
        this.buttons[0] = false;
        // this.grabbed = null;
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "";
        this.buttons[1] = false;
        this.grabbed = null;
        break;
      case 2:
        // right mouse button
        this.buttons[2] = false;
        // this.grabbed = null;
        break;
      default:
        break;
    }
  }

  function handleMouseMove(e) {
    var camera = this.app.camera;
    var scrollDirection = this.naturalScrolling ? 1 : -1;
    var newX = e.clientX + this.canvas.offsetLeft;
    var newY = e.clientY + this.canvas.offsetTop;

    this.dx = newX - this.x;
    this.dy = newY - this.y;
    this.x = newX;
    this.y = newY;

    // move selected object when left mouse button is held down
    if (this.buttons[0]) {
      if (this.grabbed) {
        // move selected element
        this.grabbed.x = this.grabbedStartingX + (this.x - this.clickX);
        this.grabbed.y = this.grabbedStartingY + (this.y - this.clickY);
      } else {
        // create new game element? Maybe?
      }
    }
    // move camera when mouse wheel is held down
    if (this.buttons[1]) {
      this.grabbed.x =
        this.grabbedStartingX -
        scrollDirection * (this.x - this.clickX) / camera.zoomLevel;
      this.grabbed.y =
        this.grabbedStartingY -
        scrollDirection * (this.y - this.clickY) / camera.zoomLevel;
    }
  }

  function handleWheel(e) {
    var grid = this.app.grid;
    var camera = this.app.camera;
    var zoomingRatePerScroll = 1.2;
    var unapplyCamera = camera.unapplyCamera.bind(camera);
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

  function handleMouseDown1(e) {
    console.log("DOWN");
  }

  function handleMouseUp1(e) {
    console.log("UP");
  }

  function handleMouseMove1(e) {
    console.log("MOVE");
  }

  function handleMouseDown2(e) {
    this.clickX = e.clientX + this.canvas.offsetLeft;
    this.clickY = e.clientY + this.canvas.offsetTop;

    this.buttons[e.button] = true;
    switch (e.button) {
      case 0:
        // left mouse button
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "grabbing";
        this.grabbed = this.app.camera;
        this.grabbedStartingX = this.grabbed.x;
        this.grabbedStartingY = this.grabbed.y;
        break;
      case 2:
        // right mouse button
        break;
      default:
        break;
    }
  }

  function handleMouseUp2(e) {
    this.releaseX = e.clientX + this.canvas.offsetLeft;
    this.releaseY = e.clientY + this.canvas.offsetTop;
    switch (e.button) {
      case 0:
        // left mouse button
        this.canvas.style.cursor = "";
        this.buttons[0] = false;
        // this.grabbed = null;
        break;
      case 1:
        // mouse wheel
        this.canvas.style.cursor = "";
        this.buttons[1] = false;
        this.grabbed = null;
        break;
      case 2:
        // right mouse button
        this.buttons[2] = false;
        // this.grabbed = null;
        break;
      default:
        break;
    }
  }

  // use NAMED event handlers only
  var contextEventHandlers = {
    0: {
      mouse: {
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
          handler: handleWheel,
          options: { passive: true }
        }
      },
      keyboard: {}
    },
    1: {
      mouse: {
        mousedown: {
          handler: handleMouseDown1,
          options: undefined
        },
        mouseup: {
          handler: handleMouseUp1,
          options: undefined
        },
        mousemove: {
          handler: handleMouseMove1,
          options: undefined
        },
        wheel: {
          handler: handleWheel,
          options: { passive: true }
        }
      },
      keyboard: {}
    },
    2: {
      mouse: {
        mousedown: {
          handler: handleMouseDown2,
          options: undefined
        },
        mouseup: {
          handler: handleMouseUp2,
          options: undefined
        },
        mousemove: {
          handler: function() {
            console.log("YOU ARE (NOT YET) MOVING OBJECTS!");
          },
          options: undefined
        },
        wheel: {
          handler: handleWheel,
          options: { passive: true }
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
          this.setEventHandlersForContext(id);
          contextID = id;
        }
      }
    }
  });

  ContextManager.prototype.init = function(app) {
    this.app = app;
    this.setEventHandlersForContext(contextID);
  };

  ContextManager.prototype.setEventHandlersForContext = function(id) {
    var app = this.app;
    // unset previous event handlers
    for (var [key, value] of Object.entries(
      contextEventHandlers[contextID].mouse
    )) {
      app.mouse.off(window, key, value.handler, value.options);
    }
    // set new event handlers
    for (var [key, value] of Object.entries(contextEventHandlers[id].mouse)) {
      app.mouse.on(window, key, value.handler, value.options);
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
