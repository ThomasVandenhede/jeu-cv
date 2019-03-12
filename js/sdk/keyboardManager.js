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

// Singleton pattern
var keyboardManager = (function() {
  var instance;

  function KeyboardManager() {
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
            this.app.state === "running"
              ? this.app.pause()
              : this.app.unpause();
            break;
          case 71:
            this.app.level.player.reverseGravity();
            break;
          // case 72:
          //   this.app.level.player.zeroGravity();
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

    // mobile input
    var buttonLeft = document.getElementById("button-left");
    var buttonRight = document.getElementById("button-right");
    var buttonA = document.getElementById("button-a");
    var buttonB = document.getElementById("button-b");

    buttonLeft.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonLeft.classList.add("touched");
        this.LEFT = true;
      }.bind(this)
    );
    buttonLeft.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonLeft.classList.remove("touched");
        this.LEFT = false;
      }.bind(this)
    );
    buttonRight.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonRight.classList.add("touched");
        this.RIGHT = true;
      }.bind(this)
    );
    buttonRight.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonRight.classList.remove("touched");
        this.RIGHT = false;
      }.bind(this)
    );
    buttonA.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonA.classList.add("touched");
        this.SPACE = true;
      }.bind(this)
    );
    buttonA.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonA.classList.remove("touched");
        this.SPACE = false;
      }.bind(this)
    );
    buttonB.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonB.classList.add("touched");
        this.ENTER = true;
      }.bind(this)
    );
    buttonB.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonB.classList.remove("touched");
        this.ENTER = false;
      }.bind(this)
    );
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
