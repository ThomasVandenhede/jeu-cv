var VirtualButton = (function() {
  function VirtualButton(game) {
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
      },
      this
    );
    buttonLeft.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonLeft.classList.remove("touched");
        this.BUTTON_LEFT = false;
      },
      this
    );
    buttonRight.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonRight.classList.add("touched");
        this.BUTTON_RIGHT = true;
      },
      this
    );
    buttonRight.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonRight.classList.remove("touched");
        this.BUTTON_RIGHT = false;
      },
      this
    );
    buttonA.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonA.classList.add("touched");
        this.BUTTON_A = true;
      },
      this
    );
    buttonA.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonA.classList.remove("touched");
        this.BUTTON_A = false;
      },
      this
    );
    buttonB.addEventListener(
      "touchstart",
      function(event) {
        event.preventDefault();
        buttonB.classList.add("touched");
        this.BUTTON_B = true;
      },
      this
    );
    buttonB.addEventListener(
      "touchend",
      function(event) {
        event.preventDefault();
        buttonB.classList.remove("touched");
        this.BUTTON_B = false;
      },
      this
    );
  }

  return VirtualButton;
})();
