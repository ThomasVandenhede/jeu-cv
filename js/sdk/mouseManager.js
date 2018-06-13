var mouseManager = (function() {
  var instance = null;

  function MouseManager() {
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

    this.canvas.addEventListener("contextmenu", function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    });

    this.canvas.addEventListener(
      "mousedown",
      function(e) {
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
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseup",
      function(e) {
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
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mousemove",
      function(e) {
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
      }.bind(this)
    );

    this.canvas.addEventListener(
      "wheel",
      function(e) {
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
              (camera.x - mouseGamePos.x) * zoomingRatePerScroll +
              mouseGamePos.x;
            camera.y =
              (camera.y - mouseGamePos.y) * zoomingRatePerScroll +
              mouseGamePos.y;
          }
        } else {
          camera.zoomLevel *= zoomingRatePerScroll;
          if (camera.zoomLevel > 8) {
            camera.zoomLevel = 8;
          } else {
            camera.x =
              (camera.x - mouseGamePos.x) / zoomingRatePerScroll +
              mouseGamePos.x;
            camera.y =
              (camera.y - mouseGamePos.y) / zoomingRatePerScroll +
              mouseGamePos.y;
          }
        }
      }.bind(this)
    );
  }

  MouseManager.prototype.init = function(app) {
    this.app = app;
  };

  MouseManager.prototype.on = function(el, type, callback) {
    console.log("ON", el, type, callback);
    el.addEventListener(type, callback, arguments[3]);
  };

  MouseManager.prototype.off = function(el, type, callback) {
    console.log("OFF", el, type, callback);
    el.removeEventListener(type, callback, arguments[3]);
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new MouseManager();
      }
      return instance;
    }
  };
})();
