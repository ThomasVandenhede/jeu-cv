var Game = require("./game/game");

window.addEventListener("DOMContentLoaded", function() {
  // go fullscreen
  document.documentElement.requestFullscreen =
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullScreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen;

  var gameContainer = document.getElementById("game-container");
  var canvases = document.getElementsByTagName("canvas");
  var startGameButton = document.getElementById("start-game");
  var gameIntroEl = document.getElementById("game-intro");

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

  startGameButton.addEventListener("click", function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    // go fullscreen
    document.documentElement.requestFullscreen &&
      document.documentElement.requestFullscreen();

    // instantiate game
    show(gameContainer);
    hide(gameIntroEl);
    window.game = new Game({
      shouldDisplayDebug: true,
      shouldDisplayRulers: true
    });

    game.start();
  });
  window.addEventListener("blur", function(e) {
    if (window.hasOwnProperty("game")) {
      game.pause();
    }
  });
  window.addEventListener("resize", resize);
  resize();

  // update debug info
  var debugEl = document.querySelector(".debug");
  if (window.hasOwnProperty("game")) {
    setInterval(function() {
      game.updateDebugInfo();
    }, 50);
  }
});
