var KeyboardManager = (function() {
  function KeyboardManager(game) {
    // reference to the game object
    this.game = game;

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

    window.addEventListener("keydown", this.handleKeydown.bind(this));

    this.keyRepeat = {};
  }

  KeyboardManager.prototype.handleKeydown = function handleKeydown(event) {
    var mouseGamePosSnappedToGrid = this.game.grid.getMouseGamePosSnappedToGrid(
      this.game.mouse.x,
      this.game.mouse.y
    );

    switch (event.keyCode) {
      case 46: // Delete
        var selection = this.game.tools[0].selection;
        if (selection.length) {
          while (selection[0]) {
            var selectedObject = selection[0].object;
            var gameObjectIndex = this.game.gameObjects.indexOf(selectedObject);
            gameObjectIndex >= 0 &&
              this.game.gameObjects.splice(gameObjectIndex, 1);
            selection.shift();
          }
        }
        break;
      case 27: // Escape
        this.game.tools[0].selection = [];
        break;
      case 65: // A key
        this.game.toolManager.tool = 0; // switch to selection context
        if (event.ctrlKey) {
          event.preventDefault();
          this.game.tools[0].selection = this.game.gameObjects.map(function(
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
        this.game.toolManager.tool = 0;
        break;
      case 67:
        this.game.toolManager.tool = 1;
        this.game.toolbar.objectTypeDropDown.focus();
        break;
      case 37:
        this.game.camera.x -= 20 / this.game.camera.zoomLevel;
        break;
      case 38:
        this.game.camera.y -= 20 / this.game.camera.zoomLevel;
        break;
      case 39:
        this.game.camera.x += 20 / this.game.camera.zoomLevel;
        break;
      case 40:
        this.game.camera.y += 20 / this.game.camera.zoomLevel;
        break;
      case 187:
        event.preventDefault();
        event.shiftKey
          ? this.game.camera.zoomOut(
              mouseGamePosSnappedToGrid.x,
              mouseGamePosSnappedToGrid.y
            )
          : this.game.camera.zoomIn(
              mouseGamePosSnappedToGrid.x,
              mouseGamePosSnappedToGrid.y
            );
        break;
      default:
    }
  };

  return KeyboardManager;
})();
