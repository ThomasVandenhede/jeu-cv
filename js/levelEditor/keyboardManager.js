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
        var mouseGamePosSnappedToGrid = this.app.grid.getMouseGamePosSnappedToGrid(
          this.app.mouse.x,
          this.app.mouse.y
        );

        switch (event.keyCode) {
          case 46: // Delete
            var selection = this.app.tools[0].selection;
            if (selection.length) {
              while (selection[0]) {
                var selectedObject = selection[0].object;
                var gameObjectIndex = this.app.gameObjects.indexOf(
                  selectedObject
                );
                gameObjectIndex >= 0 &&
                  this.app.gameObjects.splice(gameObjectIndex, 1);
                selection.shift();
              }
            }
            break;
          case 27: // Escape
            this.app.tools[0].selection = [];
            break;
          case 65: // A key
            this.app.toolManager.tool = 0; // switch to selection context
            if (event.ctrlKey) {
              event.preventDefault();
              this.app.tools[0].selection = this.app.gameObjects.map(function(
                obj
              ) {
                return {
                  object: obj,
                  objectStart: Object.assign({}, obj)
                };
              });
            }
            break;
          case 83:
            this.app.toolManager.tool = 0;
            break;
          case 67:
            this.app.toolManager.tool = 1;
            this.app.toolbar.objectTypeDropDown.focus();
            break;
          case 37:
            this.app.camera.x -= 20 / this.app.camera.zoomLevel;
            break;
          case 38:
            this.app.camera.y -= 20 / this.app.camera.zoomLevel;
            break;
          case 39:
            this.app.camera.x += 20 / this.app.camera.zoomLevel;
            break;
          case 40:
            this.app.camera.y += 20 / this.app.camera.zoomLevel;
            break;
          case 187:
            event.preventDefault();
            event.shiftKey
              ? this.app.camera.zoomOut(
                  mouseGamePosSnappedToGrid.x,
                  mouseGamePosSnappedToGrid.y
                )
              : this.app.camera.zoomIn(
                  mouseGamePosSnappedToGrid.x,
                  mouseGamePosSnappedToGrid.y
                );
            break;
          default:
        }
      }.bind(this)
    );

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
