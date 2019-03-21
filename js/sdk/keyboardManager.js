var KeyboardManager = (function() {
  // supported keys
  var codeMappings = {
    ArrowLeft: "LEFT",
    ArrowUp: "UP",
    ArrowRight: "RIGHT",
    ArrowDown: "DOWN",
    KeyW: "UP",
    KeyA: "LEFT",
    KeyS: "DOWN",
    KeyD: "RIGHT",
    KeyG: "G",
    Enter: "ENTER",
    Space: "SPACE",
    Escape: "ESCAPE",
    Equal: "EQUAL",
    Minus: "MINUS"
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
    27: "ESCAPE",
    187: "EQUAL",
    219: "MINUS"
  };

  function KeyboardManager(game) {
    this.game = game; // reference to the game object

    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.bindEventHandlers();
  }

  KeyboardManager.prototype.handleKeydown = function handleKeydown(event) {
    var code = event.code || event.keyCode;
    var mappings = event.code ? codeMappings : keyCodeMappings;
    if (mappings[code] && !this[mappings[code]]) {
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false);
      this[mappings[code]] = true;
    }

    switch (event.keyCode) {
      case 27:
        this.game.state === "running" ? this.game.pause() : this.game.unpause();
        break;
      case 71:
        this.game.level.player.reverseGravity();
        break;
      // case 72:
      //   this.game.level.player.zeroGravity();
      //   break;
      default:
    }
  };

  KeyboardManager.prototype.handleKeyup = function handleKeyup(event) {
    var code = event.code || event.keyCode;
    var mappings = event.code ? codeMappings : keyCodeMappings;
    if (mappings[code]) {
      this[mappings[code]] = false;
    }
  };

  KeyboardManager.prototype.bindEventHandlers = function() {
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keyup", this.handleKeyup);
  };

  KeyboardManager.prototype.unbindEventHandlers = function() {
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("keyup", this.handleKeyup);
  };

  return KeyboardManager;
})();
