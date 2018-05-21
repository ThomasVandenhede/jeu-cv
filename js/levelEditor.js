window.addEventListener("DOMContentLoaded", function() {
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

  // start level editor
  window.levelEditor = new LevelEditor();
  levelEditor.init({
    rulers: true
  });
  levelEditor.start();
});
