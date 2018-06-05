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
          case 46:
            var selectedObjects = this.app.mouse.selectedObjects;
            if (selectedObjects && selectedObjects.length) {
              selectedObjects.forEach(
                function(selectedObject, index) {
                  var gameObjectIndex = this.app.gameObjects.indexOf(
                    selectedObject
                  );
                  if (gameObjectIndex >= 0) {
                    this.app.gameObjects.splice(gameObjectIndex, 1);
                  }
                }.bind(this)
              );
              this.app.mouse.selectedObjects = [];
            }
            break;
          case 27:
            this.app.mouse.selectedObjects = [];
            break;
          case 71:
            this.app.player.reverseGravity();
            break;
          case 72:
            this.app.player.zeroGravity();
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
