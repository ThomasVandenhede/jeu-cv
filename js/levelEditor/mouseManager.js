var mouse = (function() {
  var instance = null;

  function Mouse() {
    this.canvas = document.getElementById("canvas");
    // mouse config
    this.naturalScrolling = true;

    // mouse state
    this.buttons = {
      0: false,
      1: false,
      2: false
    };
    this.wheel = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.releaseX = 0;
    this.releaseY = 0;
    this.x;
    this.y;
    this.dx = 0;
    this.dy = 0;
    this.grabbed = null;
    this.grabbedStartingX;
    this.grabbedStartingY;

    this.canvas.addEventListener(
      "mousedown",
      function(e) {
        this.canvas.style.cursor = "grabbing";
        this.clickX = e.clientX + this.canvas.offsetLeft;
        this.clickY = e.clientY + this.canvas.offsetTop;

        this.buttons[e.button] = true;
        switch (e.button) {
          case 0:
            // left mouse button
            break;
          case 1:
            // mouse wheel
            this.grabbed = this.context.camera;
            this.grabbedStartingX = this.grabbed.x;
            this.grabbedStartingY = this.grabbed.y;
            break;
          case 2:
            // right mouse button
            break;
          default:
            break;
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseup",
      function(e) {
        this.canvas.style.cursor = "grab";
        this.releaseX = e.clientX + this.canvas.offsetLeft;
        this.releaseY = e.clientY + this.canvas.offsetTop;
        switch (e.button) {
          case 0:
            // left mouse button
            this.buttons[0] = false;
            break;
          case 1:
            // mouse wheel
            this.buttons[1] = false;
            this.grabbed = null;
            break;
          case 2:
            // right mouse button
            this.buttons[2] = false;
            break;
          default:
            break;
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mousemove",
      function(e) {
        var newX = e.clientX + this.canvas.offsetLeft;
        var newY = e.clientY + this.canvas.offsetTop;

        this.dx = newX - this.x;
        this.dy = newY - this.y;
        this.x = newX;
        this.y = newY;
      }.bind(this)
    );

    this.canvas.addEventListener(
      "wheel",
      function(e) {
        var camera = this.context.camera;
        var unapplyCamera = camera.unapplyCamera.bind(camera);
        var deltaY = e.deltaY;
        var mouseX = e.clientX + this.canvas.offsetLeft;
        var mouseY = e.clientY + this.canvas.offsetTop;
        var mouseGamePos = unapplyCamera(mouseX, mouseY);
        var snappedMouseGamePos = new Vector(
          Math.round(mouseGamePos.x / 10) * 10,
          Math.round(mouseGamePos.y / 10) * 10
        );

        console.log(deltaY);
        if (deltaY > 0) {
          camera.zoomLevel /= 1.2;
          if (camera.zoomLevel < 0.02) {
            camera.zoomLevel = 0.02;
          } else {
            camera.x = (camera.x - mouseGamePos.x) * 1.2 + mouseGamePos.x;
            camera.y = (camera.y - mouseGamePos.y) * 1.2 + mouseGamePos.y;
          }
        } else {
          camera.zoomLevel *= 1.2;
          if (camera.zoomLevel > 3) {
            camera.zoomLevel = 3;
          } else {
            camera.x = (camera.x - mouseGamePos.x) / 1.2 + mouseGamePos.x;
            camera.y = (camera.y - mouseGamePos.y) / 1.2 + mouseGamePos.y;
          }
        }

        // update mouse precision for performance
        if (camera.zoomLevel <= 0.3) {
          this.context.grid.innerGridSize = 1000;
          this.context.grid.precisionAreaSize = 1000;
          this.context.grid.precision = 100;
          this.crossSize = 50;
        } else if (camera.zoomLevel < 0.5) {
          this.context.grid.innerGridSize = 100;
          this.context.grid.precisionAreaSize = 100;
          this.context.grid.precision = 10;
          this.crossSize = 5;
        }
      }.bind(this)
    );
  }

  Mouse.prototype.init = function(context) {
    this.context = context;
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new Mouse();
      }
      return instance;
    }
  };
})();
