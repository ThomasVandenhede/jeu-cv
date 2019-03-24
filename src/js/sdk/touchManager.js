var TouchInput = (function(game) {
  /**
   * Joypad class. Enables creating virtual "touch" joypads on-the-fly.
   */
  var Joypad = (function() {
    function Joypad(game) {
      // reference to the game object
      this.game = game;

      // minimum distance travelled by joypad to trigger action
      this.JOYPAD_THRESHOLD_X = 10;
      this.JOYPAD_THRESHOLD_Y = 10;

      // joypad
      var joypadOuter = document.getElementById("joypad-outer");
      var joypad = document.getElementById("joypad");
      this.joypadInitialLeft = parseInt(window.getComputedStyle(joypad).left);
      this.joypadInitialTop = parseInt(window.getComputedStyle(joypad).top);

      var handleJoypadTouch = function(event) {
        event.preventDefault();

        // disable transitions
        joypad.style.transition = null;

        var joypadBoundingRect = joypadOuter.getBoundingClientRect();
        var joypadCenterX = joypadBoundingRect.x + joypadBoundingRect.width / 2;
        var joypadCenterY =
          joypadBoundingRect.y + joypadBoundingRect.height / 2;

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
        var maxDeltaY =
          (Math.sin(angle) * (joypadBoundingRect.height - 50)) / 2;

        this.JOYPAD_LEFT = false;
        this.JOYPAD_RIGHT = false;
        if (deltaX > 0) {
          joypad.style.left =
            this.joypadInitialLeft + Math.min(maxDeltaX, deltaX) + "px";
          if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
            this.JOYPAD_RIGHT = true;
          }
        }
        if (deltaX < 0) {
          joypad.style.left =
            this.joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
          if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
            this.JOYPAD_LEFT = true;
          }
        }

        this.JOYPAD_UP = false;
        this.JOYPAD_DOWN = false;
        if (deltaY > 0) {
          joypad.style.top =
            this.joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
          // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
          //   this.JOYPAD_DOWN = true;
          // }
        }
        if (deltaY < 0) {
          joypad.style.top =
            this.joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
          // if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
          //   this.JOYPAD_UP = true;
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
          joypad.style.top = this.joypadInitialTop + "px";
          joypad.style.left = this.joypadInitialLeft + "px";
          this.JOYPAD_UP = false;
          this.JOYPAD_DOWN = false;
          this.JOYPAD_RIGHT = false;
          this.JOYPAD_LEFT = false;
        }.bind(this)
      );
    }

    return Joypad;
  })();

  /**
   * Button class. Enables creating virtual "touch" buttons on-the-fly.
   */
  var Button = (function() {
    function Button(game) {
      // reference to the game object
      this.game = game;

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
          this.BUTTON_LEFT = true;
        }.bind(this)
      );
      buttonLeft.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonLeft.classList.remove("touched");
          this.BUTTON_LEFT = false;
        }.bind(this)
      );
      buttonRight.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonRight.classList.add("touched");
          this.BUTTON_RIGHT = true;
        }.bind(this)
      );
      buttonRight.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonRight.classList.remove("touched");
          this.BUTTON_RIGHT = false;
        }.bind(this)
      );
      buttonA.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonA.classList.add("touched");
          this.BUTTON_A = true;
        }.bind(this)
      );
      buttonA.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonA.classList.remove("touched");
          this.BUTTON_A = false;
        }.bind(this)
      );
      buttonB.addEventListener(
        "touchstart",
        function(event) {
          event.preventDefault();
          buttonB.classList.add("touched");
          this.BUTTON_B = true;
        }.bind(this)
      );
      buttonB.addEventListener(
        "touchend",
        function(event) {
          event.preventDefault();
          buttonB.classList.remove("touched");
          this.BUTTON_B = false;
        }.bind(this)
      );
    }

    return Button;
  })();

  // Public methods.
  return {
    addJoypad: function(name, props) {
      var joypad = new Joypad(game, props);
      this[name] = joypad;
      return joypad;
    },
    addButton: function(name, props) {
      var button = new Button(game, props);
      this[name] = button;
      return button;
    }
  };
})(window.game);

var TouchManager = (function() {
  function TouchManager(game) {
    // reference to the game object
    this.game = game;

    // minimum distance travelled by joypad to trigger action
    this.JOYPAD_THRESHOLD_X = 10;
    this.JOYPAD_THRESHOLD_Y = 10;

    // joypad
    this.joypadOuter = document.getElementById("joypad-outer");
    this.joypad = document.getElementById("joypad");
    this.joypadInitialLeft = parseInt(
      window.getComputedStyle(this.joypad).left
    );
    this.joypadInitialTop = parseInt(window.getComputedStyle(this.joypad).top);

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
        this.JOYPAD_LEFT = true;
      }.bind(this)
    );
    this.buttonLeft.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonLeft.classList.remove("touched");
        this.JOYPAD_LEFT = false;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.add("touched");
        this.JOYPAD_RIGHT = true;
      }.bind(this)
    );
    this.buttonRight.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        this.buttonRight.classList.remove("touched");
        this.JOYPAD_RIGHT = false;
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

    var joypadBoundingRect = this.joypadOuter.getBoundingClientRect();
    var joypadCenterX = joypadBoundingRect.x + joypadBoundingRect.width / 2;
    var joypadCenterY = joypadBoundingRect.y + joypadBoundingRect.height / 2;

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
    var touchX = eventTouch.pageX;
    var touchY = eventTouch.pageY;

    // joypad displacement
    var deltaX = touchX - joypadCenterX;
    var deltaY = touchY - joypadCenterY;
    var angle = Math.atan2(deltaY, deltaX);

    // confine joypad to the outer circle
    var maxDeltaX = (Math.cos(angle) * (joypadBoundingRect.width - 50)) / 2;
    var maxDeltaY = (Math.sin(angle) * (joypadBoundingRect.height - 50)) / 2;

    this.JOYPAD_LEFT = false;
    this.JOYPAD_RIGHT = false;
    if (deltaX > 0) {
      this.joypad.style.left =
        this.joypadInitialLeft + Math.min(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_RIGHT = true;
      }
    }
    if (deltaX < 0) {
      this.joypad.style.left =
        this.joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
      if (Math.abs(deltaX) >= this.JOYPAD_THRESHOLD_X) {
        this.JOYPAD_LEFT = true;
      }
    }

    this.JOYPAD_UP = false;
    this.JOYPAD_DOWN = false;
    if (deltaY > 0) {
      this.joypad.style.top =
        this.joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_DOWN = true;
      }
    }
    if (deltaY < 0) {
      this.joypad.style.top =
        this.joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
      if (Math.abs(deltaY) >= this.JOYPAD_THRESHOLD_Y) {
        // this.JOYPAD_UP = true;
      }
    }
  };

  TouchManager.prototype.handleJoypadTouchEnd = function handleJoypadTouchEnd(
    event
  ) {
    event.preventDefault();
    this.joypad.style.transition = "all 0.07s ease-in-out";
    this.joypad.style.top = this.joypadInitialTop + "px";
    this.joypad.style.left = this.joypadInitialLeft + "px";
    this.JOYPAD_UP = false;
    this.JOYPAD_DOWN = false;
    this.JOYPAD_RIGHT = false;
    this.JOYPAD_LEFT = false;
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
