var LevelEditor = (function() {
  function LevelEditor(options) {
    this.data = {};
  }

  LevelEditor.prototype.init = function(config) {
    this.shouldDisplayRulers =
      config.shouldDisplayRulers !== undefined
        ? config.shouldDisplayRulers
        : true;
    this.canvas = document.getElementById("canvas");
    this.backgroundCanvas = document.getElementById("background");
    this.camera = new Camera(this, -1000, -1000, 0.05);
    this.ctx = this.canvas.getContext("2d");
    this.bgCtx = this.backgroundCanvas.getContext("2d");
    this.keyboard = keyboardManager.getInstance();
    this.mouse = mouse.getInstance();
    this.mouse.init(this); // pass the game object to the mouse as its context
    // this.mouse.on("mousedown", handleMouseDown);
    // this.mouse.on("mousemove", handleMouseMove);
    // this.mouse.on("mouseup", handleMouseUp);
    // this.mouse.on("wheel", handleWheel, { passive: true });
    this.contextManager = contextManager.getInstance();
    this.contextManager.init(this);
    this.toolbar = toolbarFactory.getInstance();
    this.toolbar.init(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);
    this.grid = new Grid(this);

    // different tools for the editor
    this.tool = {
      selection: true,
      creation: false
    };

    // initialize world size
    worldRect = new AABB(0, 0, 10000, 10000);

    // initialize world objects
    this.drawables = [];

    // initialize background
    this.starCount = 0;
    this.stars = [];
    for (var i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.floor(Math.random() * (this.canvas.width + 1)),
        y: Math.floor(Math.random() * (this.canvas.height + 1)),
        r: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.4
      });
    }
  };

  LevelEditor.prototype.handleKeyboard = function() {};

  LevelEditor.prototype.updateScene = function() {
    // update objects to be rendered
    this.camera.update();
  };

  LevelEditor.prototype.renderBackground = function(ctx) {
    this.fillCanvas(ctx, "#111");
    ctx.save();
    for (var i = 0; i < this.starCount; i++) {
      var star = this.stars[i];
      ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
      ctx.beginPath();
      ctx.arc(
        (star.x - this.camera.x * 0.3 + this.canvas.width) % this.canvas.width,
        (star.y - this.camera.y * 0.3 + this.canvas.height) %
          this.canvas.height,
        star.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();
  };

  LevelEditor.prototype.updateTimeEllapsed = function() {
    this.previousTime = this.currentTime || Date.now();
    this.currentTime = Date.now();
    return (this.currentTime - this.previousTime) / 1000;
  };

  LevelEditor.prototype.clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  LevelEditor.prototype.fillCanvas = function(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  LevelEditor.prototype.drawGrid = function(ctx) {
    this.grid.draw(ctx, this.camera);
  };

  LevelEditor.prototype.renderScene = function(ctx, camera) {
    // optimize rendering by only drawing objects that are on screen
    this.drawGrid(ctx);
    for (var i = 0; i < this.drawables.length; i++) {
      var drawable = this.drawables[i];
      drawable.overlaps(camera.viewportRect) && drawable.draw(ctx, camera);
    }

    // draw worldRect
    var worldRect = window.worldRect;
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.strokeRect.apply(
      ctx,
      applyCamToArr(worldRect.x, worldRect.y).concat(
        worldRect.width * camera.zoomLevel,
        worldRect.height * camera.zoomLevel
      )
    );
    ctx.stroke();

    ctx.restore();
  };

  LevelEditor.prototype.start = function() {
    this.main();
  };

  LevelEditor.prototype.main = function() {
    var camera = this.camera;
    dt = this.updateTimeEllapsed();
    // this.handleKeyboard();
    this.updateScene();
    this.clearCanvas(this.ctx, camera);
    this.renderBackground(this.ctx, camera);
    this.renderScene(this.ctx, camera);

    requestAnimationFrame(this.main.bind(this));
  };

  LevelEditor.prototype.getDownLink = function() {
    var json = JSON.stringify(this.data);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var oldDownloadLink = document.getElementById("download-link");
    oldDownloadLink &&
      oldDownloadLink.parentElement.removeChild(oldDownloadLink);

    var toolbar = document.getElementById("toolbar");
    var a = document.createElement("a");
    toolbar.appendChild(a);
    a.download = "data.json";
    a.id = "download-link";
    a.href = url;
    a.textContent = "Download level data";
  };

  return LevelEditor;
})();
