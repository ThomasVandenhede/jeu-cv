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
  var instance;

  function KeyboardManager(game) {
    // reference to the game object
    this.game = game;

    window.addEventListener(
      "keydown",
      function(event) {
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
            this.game.state === "running"
              ? this.game.pause()
              : this.game.unpause();
            break;
          case 71:
            this.game.level.player.reverseGravity();
            break;
          // case 72:
          //   this.game.level.player.zeroGravity();
          //   break;
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
          this[mappings[code]] = false;
        }
      }.bind(this)
    );
  }

  return KeyboardManager;
})();
