var Game = require("./game/game");

window.addEventListener("DOMContentLoaded", function() {
  // go fullscreen
  document.documentElement.requestFullscreen =
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullScreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen;

  var canvases = document.getElementsByTagName("canvas");
  var startGameButton = document.getElementById("start-game");

  function resize() {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      var canvasWidth = parseFloat(getComputedStyle(canvas).width);
      var canvasHeight = parseFloat(getComputedStyle(canvas).height);
      // change resolution
      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", canvasHeight);
    }
  }

  window.addEventListener("resize", resize);

  startGameButton.addEventListener("click", function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    resize();

    // instantiate game
    window.game = new Game({
      displayRulers: true,
      displayDebug: false
    });

    game.start();
  });

  // update debug info
  if (window.hasOwnProperty("game")) {
    setInterval(function() {
      game.updateDebugInfo();
    }, 50);
  }
});
