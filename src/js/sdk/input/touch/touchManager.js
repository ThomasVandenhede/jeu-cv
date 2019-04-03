var modes = {
  SPRING_IN: 0,
  SPRING_OUT: 1,
  STATIC: 2,
  DEFAULT: this.SPRING_IN
};

var TouchManager = (function() {
  function TouchManager(game) {
    // reference to the game object
    this.game = game;

    // minimum distance travelled by joypad to trigger action
    this.JOYPAD_THRESHOLD_X = 10;
    this.JOYPAD_THRESHOLD_Y = 10;

    // joypad
    this.joypadMode = modes.DEFAULT;
    this.joypadOuter = document.getElementById("joypad-outer");
    this.joypad = document.getElementById("joypad");

    this.joypadWidth = parseInt(window.getComputedStyle(this.joypad).width);
    this.joypadHeight = parseInt(window.getComputedStyle(this.joypad).height);

    this.handleJoypadTouch = this.handleJoypadTouch.bind(this);
    this.handleJoypadTouchEnd = this.handleJoypadTouchEnd.bind(this);

    this.bindEventHandlers();

    // mobile input
    this.buttonLeft = document.getElementById("button-left-clickable-area");
    this.buttonRight = document.getElementById("button-right-clickable-area");
    this.buttonA = document.getElementById("button-a-clickable-area");
    this.buttonB = document.getElementById("button-b-clickable-area");

    this.buttonLeft.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonLeft.classList.add("touched");
        this.BUTTON_LEFT = true;
      }.bind(this)
    );
    this.buttonLeft.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonLeft.classList.remove("touched");
        this.BUTTON_LEFT = false;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.add("touched");
        this.BUTTON_RIGHT = true;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.remove("touched");
        this.BUTTON_RIGHT = false;
      }.bind(this)
    );
    this.buttonA.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonA.classList.add("touched");
        this.BUTTON_A = true;
      }.bind(this)
    );
    this.buttonA.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonA.classList.remove("touched");
        this.BUTTON_A = false;
      }.bind(this)
    );
    this.buttonB.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonB.classList.add("touched");
        this.BUTTON_B = true;
      }.bind(this)
    );
    this.buttonB.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonB.classList.remove("touched");
        this.BUTTON_B = false;
      }.bind(this)
    );
  }

  TouchManager.prototype.handleJoypadTouch = function handleJoypadTouch(event) {
    event.preventDefault();

    // disable transitions
    this.joypad.style.transition = null;

    // find joypad origin (center)
    var joypadOuterRect = this.joypadOuter.getBoundingClientRect();
    var joypadOriginX = joypadOuterRect.left + joypadOuterRect.width / 2;
    var joypadOriginY = joypadOuterRect.top + joypadOuterRect.height / 2;

    // retrieve the touch associated with this event
    var eventTouch = null;
    for (var i = 0; i < event.touches.length; i++) {
      var touch = event.touches.item(i);
      if (touch.target === this.joypadOuter || touch.target === joypad) {
        eventTouch = touch;
        break;
      }
    }

    // touch coordinates
    var touchX = eventTouch.clientX;
    var touchY = eventTouch.clientY;

    // joypad displacement
    var deltaX = touchX - joypadOriginX;
    var deltaY = touchY - joypadOriginY;
    var angle = Math.atan2(deltaY, deltaX);

    // confine joypad to the outer circle
    var maxDeltaX =
      (Math.cos(angle) * (joypadOuterRect.width - this.joypadWidth)) / 2;
    var maxDeltaY =
      (Math.sin(angle) * (joypadOuterRect.height - this.joypadHeight)) / 2;

    this.JOYPAD_LEFT = false;
    this.JOYPAD_RIGHT = false;
    if (deltaX > 0) {
      this.joypad.style.left =
        joypadOuterRect.width / 2 + Math.min(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_RIGHT = true;
      }
    }
    if (deltaX < 0) {
      this.joypad.style.left =
        joypadOuterRect.width / 2 + Math.max(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_LEFT = true;
      }
    }

    this.JOYPAD_UP = false;
    this.JOYPAD_DOWN = false;
    if (deltaY > 0) {
      this.joypad.style.top =
        joypadOuterRect.height / 2 + Math.min(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_DOWN = true;
      }
    }
    if (deltaY < 0) {
      this.joypad.style.top =
        joypadOuterRect.height / 2 + Math.max(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_UP = true;
      }
    }
  };

  TouchManager.prototype.handleJoypadTouchEnd = function handleJoypadTouchEnd(
    event
  ) {
    event.preventDefault();
    var joypadOuterRect = this.joypadOuter.getBoundingClientRect();

    if (this.joypadMode === modes.SPRING_IN) {
      this.joypad.style.transition = "all 0.07s ease-in-out";
      this.joypad.style.left = joypadOuterRect.width / 2 + "px";
      this.joypad.style.top = joypadOuterRect.height / 2 + "px";
      this.JOYPAD_UP = false;
      this.JOYPAD_DOWN = false;
      this.JOYPAD_RIGHT = false;
      this.JOYPAD_LEFT = false;
    }

    if (this.joypadMode === modes.SPRING_OUT) {
      this.joypad.style.transition = "all 0.07s ease-in-out";
      this.joypad.style.left = joypadOuterRect.width / 2 + "px";
      this.joypad.style.top = joypadOuterRect.height / 2 + "px";
    }
  };

  TouchManager.prototype.bindEventHandlers = function bindEventHandlers() {
    this.joypadOuter.addEventListener("touchstart", this.handleJoypadTouch);
    this.joypadOuter.addEventListener("touchmove", this.handleJoypadTouch);
    this.joypadOuter.addEventListener("touchend", this.handleJoypadTouchEnd);
  };

  TouchManager.prototype.unbindEventHandlers = function unbindEventHandlers() {
    this.joypadOuter.removeEventListener("touchstart", this.handleJoypadTouch);
    this.joypadOuter.removeEventListener("touchmove", this.handleJoypadTouch);
    this.joypadOuter.removeEventListener("touchend", this.handleJoypadTouchEnd);
  };

  return TouchManager;
})();

module.exports = TouchManager;
