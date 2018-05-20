// Singleton pattern
var keyboardManager = (function () {
  var instance;

  function KeyboardManager() {
    var that = this;
    var codeMappings = {
      ArrowLeft: "LEFT",
      ArrowUp: "UP",
      ArrowRight: "RIGHT",
      ArrowDown: "DOWN",
      // KeyW: "UP",
      // KeyA: "LEFT",
      // KeyS: "DOWN",
      // KeyD: "RIGHT",
      Enter: "ENTER",
      Space: "SPACE",
      Escape: "ESCAPE"
    };
    var keyCodeMappings = {
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      // KeyW: "UP",
      // KeyA: "LEFT",
      // KeyS: "DOWN",
      // KeyD: "RIGHT",
      13: "ENTER",
      32: "SPACE",
      27: "ESCAPE"
    };

    window.addEventListener("keydown", function (event) {
      var code = event.code || event.keyCode;
      var mappings = (event.code) ? codeMappings : keyCodeMappings;
      if (mappings[code] && !that[mappings[code]]) {
        that[mappings[code]] = true;
      }
    });

    window.addEventListener("keyup", function (event) {
      var code = event.code || event.keyCode;
      var mappings = (event.code) ? codeMappings : keyCodeMappings;
      if (mappings[code]) {
        that[mappings[code]] = false;
      }
    });

    this.UP = false;
    this.DOWN = false;
    this.RIGHT = false;
    this.LEFT = false;
    this.ENTER = false;
    this.SPACE = false;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = new KeyboardManager();
      }
      return instance;
    }
  };
})();
