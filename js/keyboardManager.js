// Singleton pattern
var keyboardManager = (function() {
  var instance;

  function KeyboardManager() {
    var that = this;
    var keyMappings = {
      ArrowUp: "UP",
      ArrowLeft: "LEFT",
      ArrowDown: "DOWN",
      ArrowRight: "RIGHT",
      KeyW: "UP",
      KeyA: "LEFT",
      KeyS: "DOWN",
      KeyD: "RIGHT",
      Enter: "ENTER",
      Space: "SPACE",
      Escape: "ESCAPE"
    };

    window.onkeydown = function(event) {
      if (keyMappings[event.code] && !that[keyMappings[event.code]]) {
        that[keyMappings[event.code]] = true;
      }
    };

    window.onkeyup = function(event) {
      if (keyMappings[event.code]) {
        that[keyMappings[event.code]] = false;
      }
    };

    // this.UP = false;
    // this.DOWN = false;
    // this.RIGHT = false;
    // this.LEFT = false;
    // this.ENTER = false;
    // this.SPACE = false;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = new KeyboardManager();
      }
      return instance;
    }
  };
})();
