var VirtualJoypad = (function() {
  function VirtualJoypad(game) {
    // reference to the game object
    this.game = game;

    // minimum distance travelled by joypad to trigger action
    this.THRESHOLD_X = 10;
    this.THRESHOLD_Y = 10;
    this.SPRING_BACK_TO_RESTING_POSITION = false;

    // var joypadOuterStyle = {
    //   touchAction: "none",
    //   width: "150px",
    //   height: "150px",
    //   borderRadius: "50%",
    //   backgroundColor: "rgba(120, 120, 120, 0.3)"
    // };
    // var joypadStyle = {
    //   width: "60px",
    //   height: "60px",
    //   borderRadius: "50%",
    //   position: "relative",
    //   backgroundColor: "#333",
    //   left: "50%",
    //   top: "50%",
    //   transform: "translate(-50%, -50%)",
    //   boxShadow:
    //     "inset 0 10px 14px 0 rgba(255, 255, 255, 0.5), inset 0 -10px 14px 0 rgba(0, 0, 0, 0.5), 0 5px 15px 0 rgba(0, 0, 0, 0.8)"
    // };

    // joypad
    var joypadOuter = document.getElementById("joypad-outer");
    // joypadOuter.setAttribute("style", joypadOuterStyle);
    var joypad = document.getElementById("joypad");
    // joypad.style = joypadStyle;
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
        if (Math.abs(deltaX) >= this.THRESHOLD_X) {
          this.RIGHT = true;
        }
      }
      if (deltaX < 0) {
        joypad.style.left =
          joypadInitialLeft + Math.max(maxDeltaX, deltaX) + "px";
        if (Math.abs(deltaX) >= this.THRESHOLD_X) {
          this.LEFT = true;
        }
      }

      this.UP = false;
      this.DOWN = false;
      if (deltaY > 0) {
        joypad.style.top =
          joypadInitialTop + Math.min(maxDeltaY, deltaY) + "px";
        if (Math.abs(deltaY) >= this.THRESHOLD_Y) {
          this.DOWN = true;
        }
      }
      if (deltaY < 0) {
        joypad.style.top =
          joypadInitialTop + Math.max(maxDeltaY, deltaY) + "px";
        if (Math.abs(deltaY) >= this.THRESHOLD_Y) {
          this.UP = true;
        }
      }
    }.bind(this);

    joypadOuter.addEventListener("touchstart", handleJoypadTouch);
    joypadOuter.addEventListener("touchmove", handleJoypadTouch);
    joypadOuter.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        if (this.SPRING_BACK_TO_RESTING_POSITION) {
          // joypad.style.transition = "all 0.07s ease-in-out";
          joypad.style.top = joypadInitialTop + "px";
          joypad.style.left = joypadInitialLeft + "px";
        }
        this.UP = false;
        this.DOWN = false;
        this.RIGHT = false;
        this.LEFT = false;
      }.bind(this)
    );
  }

  return VirtualJoypad;
})();
