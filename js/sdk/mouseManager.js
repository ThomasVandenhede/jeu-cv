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
    this.grabbed = null;
    this.grabbedStartingX;
    this.grabbedStartingY;

    this.eventListeners = {};

    this.canvas.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
  }

  Mouse.prototype.init = function(app) {
    this.app = app;
  };

  Mouse.prototype.on = function(el, type, callback) {
    var eventHandler = callback.bind(this);
    this.eventListeners[callback.name] = eventHandler;
    el.addEventListener(type, eventHandler, arguments[3]);
  };

  Mouse.prototype.off = function(el, type, callback) {
    var eventHandler = this.eventListeners[callback.name];
    el.removeEventListener(type, eventHandler, arguments[3]);
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
