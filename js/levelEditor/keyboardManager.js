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
            if (this.app.mouse.selection.length) {
              while (this.app.mouse.selection[0]) {
                var selectedObject = this.app.mouse.selection[0].object;
                var gameObjectIndex = this.app.gameObjects.indexOf(
                  selectedObject
                );
                gameObjectIndex >= 0 &&
                  this.app.gameObjects.splice(gameObjectIndex, 1);
                this.app.mouse.selection.shift();
              }
            }
            break;
          case 27: // Escape
            this.app.mouse.selection = [];
            break;
          case 65: // A key
            this.app.toolManager.tool = 0; // switch to selection context
            if (event.ctrlKey) {
              event.preventDefault();
              this.app.mouse.selection = this.app.gameObjects.map(function(
                obj
              ) {
                return {
                  object: obj,
                  startingRect: new AABB({
                    x: obj.x,
                    y: obj.y,
                    width: obj.width,
                    height: obj.height
                  })
                };
              });
            }
            break;
          case 83:
            this.app.toolManager.tool = 0;
            break;
          case 67:
            this.app.toolManager.tool = 1;
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
