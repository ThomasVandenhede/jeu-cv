var LevelEditor = (function() {
  function LevelEditor(options) {}

  LevelEditor.prototype.init = function(config) {
    this.rulers = config.rulers !== undefined ? config.rulers : true;
    this.canvas = document.getElementById("canvas");
    this.backgroundCanvas = document.getElementById("background");
    this.camera = new Camera(this, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx = this.canvas.getContext("2d");
    this.bgCtx = this.backgroundCanvas.getContext("2d");
    this.keyboard = keyboardManager.getInstance();
    this.mouse = mouse.getInstance();
    this.mouse.init(this); // pass the game object to the mouse as its context
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData.sounds);
    this.grid = new Grid(this);

    // different tools for the editor
    this.tool = {
      selection: true,
      creation: false
    };

    // initialize world size
    worldRect = new AABB(0, 0, 20000, 20000);

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

  LevelEditor.prototype.handleMouse = function() {
    var mouse = this.mouse;
    var camera = this.camera;
    // move selected object when left mouse button is held down
    if (mouse.buttons[0]) {
      if (mouse.grabbed) {
        // move selected element
        mouse.grabbed.x = mouse.grabbedStartingX + (mouse.x - mouse.clickX);
        mouse.grabbed.y = mouse.grabbedStartingY + (mouse.y - mouse.clickY);
      } else {
        // create new game element? Maybe?
      }
    }
    // move camera when mouse wheel is held down
    if (mouse.buttons[1]) {
      var scrollDirection = mouse.naturalScrolling ? 1 : -1;
      mouse.grabbed.x =
        mouse.grabbedStartingX -
        scrollDirection * (mouse.x - mouse.clickX) / camera.zoomLevel;
      mouse.grabbed.y =
        mouse.grabbedStartingY -
        scrollDirection * (mouse.y - mouse.clickY) / camera.zoomLevel;
    }
  };

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
      ctx.closePath();
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
    ctx.closePath();
    ctx.restore();
  };

  LevelEditor.prototype.start = function() {
    this.main();
  };

  LevelEditor.prototype.main = function() {
    var camera = this.camera;
    dt = this.updateTimeEllapsed();
    // this.handleKeyboard();
    this.handleMouse();
    this.updateScene();
    this.clearCanvas(this.ctx, camera);
    this.renderBackground(this.ctx, camera);
    this.renderScene(this.ctx, camera);

    requestAnimationFrame(this.main.bind(this));
  };

  return LevelEditor;
})();
