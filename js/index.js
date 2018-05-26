window.addEventListener("DOMContentLoaded", function () {
  function fitCanvasToContainer() {
    var canvases = document.getElementsByTagName("canvas");
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.setAttribute(
        "width",
        parseFloat(window.getComputedStyle(canvas).width)
      );
      canvas.setAttribute(
        "height",
        parseFloat(window.getComputedStyle(canvas).height)
      );
    }
  }
  window.addEventListener("resize", fitCanvasToContainer);
  fitCanvasToContainer();

  var game = new Game();
  game.init({
    shouldDisplayDebug: false,
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
