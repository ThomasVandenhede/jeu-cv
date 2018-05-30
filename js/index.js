window.addEventListener("DOMContentLoaded", function() {
  function fitCanvasToContainer() {
    var canvasContainer = document.getElementById("canvas-container");
    var canvases = document.getElementsByTagName("canvas");
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      var canvasWidth = parseFloat(window.getComputedStyle(canvas).width);
      var canvasHeight = Math.min(
        canvasWidth / 21 * 9,
        parseFloat(window.getComputedStyle(canvasContainer).height)
      );
      // change resolution
      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", canvasHeight);

      // change size to preserve aspect ratio
      canvas.style.height = canvasHeight + "px";
    }
  }

  var canvas = document.getElementById("canvas");
  window.addEventListener("blur", function(e) {
    if (game) {
      game.pause();
    }
  });
  window.addEventListener("resize", fitCanvasToContainer);
  fitCanvasToContainer();

  var game = new Game();
  game.init({
    shouldDisplayDebug: true,
    shouldDisplayRulers: true
  });
  game.startGame();

  var debug = document.querySelector(".debug");
  if (game.shouldDisplayDebug) {
    debug.classList.remove("hidden");
    setInterval(function() {
      game.updateDebugInfo();
    }, 50);
  } else {
    debug.classList.add("hidden");
  }
});
