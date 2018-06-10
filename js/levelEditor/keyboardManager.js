// Singleton pattern
var keyboardManager = (function() {
  var instance;

  function KeyboardManager() {
    var codeMappings = {
      ArrowLeft: "LEFT",
      ArrowUp: "UP",
      ArrowRight: "RIGHT",
      ArrowDown: "DOWN",
      KeyW: "UP",
      KeyA: "LEFT",
      KeyS: "DOWN",
      KeyD: "RIGHT",
      Enter: "ENTER",
      Space: "SPACE",
      Escape: "ESCAPE"
    };
    var keyCodeMappings = {
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      90: "UP",
      81: "LEFT",
      93: "DOWN",
      68: "RIGHT",
      13: "ENTER",
      32: "SPACE",
      27: "ESCAPE"
    };

    window.addEventListener(
      "keydown",
      function(event) {
        var code = event.code || event.keyCode;
        var mappings = event.code ? codeMappings : keyCodeMappings;
        if (mappings[code] && !this[mappings[code]]) {
          if (this[mappings[code]]) {
            this.keyRepeat[code] = true;
          }
          this[mappings[code]] = true;
        }

        switch (event.keyCode) {
          case 46: // Delete
            var selectedObjects = this.app.mouse.selectedObjects;
            if (selectedObjects && selectedObjects.length) {
              while (selectedObjects[0]) {
                var selectedObject = selectedObjects[0];
                var gameObjectIndex = this.app.gameObjects.indexOf(
                  selectedObject
                );
                gameObjectIndex >= 0 &&
                  this.app.gameObjects.splice(gameObjectIndex, 1);
              }
              this.app.mouse.selectedObjects.shift();
            }
            break;
          case 27: // Escape
            this.app.mouse.selectedObjects = [];
            break;
          case 65: // A key
            event.preventDefault();
            if (event.ctrlKey) {
              this.app.mouse.selectedObjects = this.app.gameObjects;
            }
            break;
          default:
        }
      }.bind(this)
    );

    window.addEventListener(
      "keyup",
      function(event) {
        var code = event.code || event.keyCode;
        var mappings = event.code ? codeMappings : keyCodeMappings;
        if (mappings[code]) {
          this.keyRepeat[code] = false;
          this[mappings[code]] = false;
        }
      }.bind(this)
    );

    this.UP = false;
    this.DOWN = false;
    this.RIGHT = false;
    this.LEFT = false;
    this.ENTER = false;
    this.SPACE = false;

    this.keyRepeat = {};
  }

  KeyboardManager.prototype.init = function(app) {
    this.app = app;
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new KeyboardManager();
      }
      return instance;
    }
  };
})();
