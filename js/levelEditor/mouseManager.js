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

    this.canvas.addEventListener("contextmenu", function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);;
    });
  }

  Mouse.prototype.init = function(context) {
    this.context = context;
  };

  Mouse.prototype.on = function(type, callback) {
    window.addEventListener(type, callback.bind(this), arguments[2]);
  };

  Mouse.prototype.off = function(type, callback) {
    window.removeEventListener(type, callback.bind(this), arguments[2]);
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
