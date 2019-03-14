var keyboardManager = (function() {
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

  function KeyboardManager() {
    // minimum distance travelled by joypad to trigger action
    this.JOYPAD_THRESHOLD_X = 10;
    this.JOYPAD_THRESHOLD_Y = 10;

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

    // joypad
    var joypadOuter = document.getElementById("joypad-outer");
    var joypad = document.getElementById("joypad");
    var joypadInitialLeft = parseInt(window.getComputedStyle(joypad).left);
    var joypadInitialTop = parseInt(window.getComputedStyle(joypad).top);

    var handleJoypadTouch = function(event) {
      event.preventDefault();

      // disable transitions
      joypad.style.transition = null;

      var joypadBoundingRect = joypadOuter.getBoundingClientRect();
      var joypadCenterX = joypadBoundingRect.x + joypadBoundingRect.width / 2;
      var joypadCenterY = joypadBoundingRect.y + joypadBoundingRect.height / 2;

      // retrieve the touch associated with this event
      var eventTouch = null;
      for (var i = 0; i < event.touches.length; i++) {
        var touch = event.touches.item(i);
        if (touch.target === joypadOuter || touch.target === joypad) {
          eventTouch = touch;
          break;
        }
      }

      // touch coordinates
      var touchX = eventTouch.pageX;
      var touchY = eventTouch.pageY;

      // joypad displacement
      var deltaX = touchX - joypadCenterX;
      var deltaY = touchY - joypadCenterY;
      var angle = Math.atan2(deltaY, deltaX);

      // confine joypad to the outer circle
      var maxDeltaX = (Math.cos(angle) * (joypadBoundingRect.width - 50)) / 2;
      var maxDeltaY = (Math.sin(angle) * (joypadBoundingRect.height - 50)) / 2;

      this.LEFT = false;
      this.RIGHT = false;
      if (deltaX > 0) {
        joypad.style.left =
          joypadInitialLeft + Math.min(maxDeltaX, deltaX) + "px";
        if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
          this.RIGHT = true;
        }
      }
      if (deltaX < 0) {
        joypad.style.left =
          joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
        if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
          this.LEFT = true;
        }
      }

      this.UP = false;
      this.DOWN = false;
      if (deltaY > 0) {
        joypad.style.top =
          joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
        // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        //   this.DOWN = true;
        // }
      }
      if (deltaY < 0) {
        joypad.style.top =
          joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
        // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        //   this.UP = true;
        // }
      }
    }.bind(this);

    joypadOuter.addEventListener("touchstart", handleJoypadTouch);
    joypadOuter.addEventListener("touchmove", handleJoypadTouch);

    joypadOuter.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        joypad.style.transition = "all 0.07s ease-in-out";
        joypad.style.top = joypadInitialTop + "px";
        joypad.style.left = joypadInitialLeft + "px";
        this.UP = false;
        this.DOWN = false;
        this.RIGHT = false;
        this.LEFT = false;
      }.bind(this)
    );

    // mobile input
    var buttonLeft = document.getElementById("button-left-clickable-area");
    var buttonRight = document.getElementById("button-right-clickable-area");
    var buttonA = document.getElementById("button-a-clickable-area");
    var buttonB = document.getElementById("button-b-clickable-area");

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
