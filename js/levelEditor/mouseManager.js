var mouse = (function () {
  var instance = null;

  function Mouse() {
    this.canvas = document.getElementById('canvas');
    // mouse config
    this.naturalScrolling = true;

    // mouse state
    this.buttons = {
      0: false,
      1: false,
      2: false
    }
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

    window.addEventListener('mousedown', function (e) {
      this.canvas.style.cursor = "grabbing";
      this.clickX = e.clientX + this.canvas.offsetLeft;
      this.clickY = e.clientY + this.canvas.offsetTop;
      switch (e.button) {
        case 0:
          // left mouse button
          this.buttons[0] = true;
          break;
        case 1:
          // mouse wheel
          this.buttons[1] = true;
          this.grabbed = this.context.camera;
          this.grabbedStartingX = this.grabbed.x;
          this.grabbedStartingY = this.grabbed.y;
          break;
        case 2:
          // right mouse button
          this.buttons[2] = true;
          break;
        default:
          break;
      }
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
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
    }.bind(this));

    window.addEventListener('mousemove', function (e) {
      var newX = e.clientX + this.canvas.offsetLeft;
      var newY = e.clientY + this.canvas.offsetTop;

      this.dx = newX - this.x;
      this.dy = newY - this.y;
      this.x = newX;
      this.y = newY;
    }.bind(this));

    window.addEventListener('wheel', function (e) {
      this.wheel += e.deltaY;
    }.bind(this));
  };

  Mouse.prototype.init = function (context) {
    this.context = context;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = new Mouse();
      }
      return instance;
    }
  };
})();
