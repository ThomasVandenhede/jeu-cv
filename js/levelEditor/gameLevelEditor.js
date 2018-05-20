var LevelEditor = (function () {
  function LevelEditor(options) { }

  LevelEditor.prototype.init = function (config) {
    this.rulers = config.rulers !== undefined ? config.rulers : true;
    this.canvas = document.getElementById("canvas");
    this.backgroundCanvas = document.getElementById("background");
    this.camera = new Camera(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
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
    worldRect = new AABB(0, -100000, 3000, 102000);

    // initialize world objects
    this.drawables = [];

    // initialize background
    this.starCount = 500;
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

  LevelEditor.prototype.handleKeyboard = function () {
  };

  LevelEditor.prototype.handleMouse = function () {
    // move selected object when left mouse button is held down
    if (this.mouse.buttons[0]) {
      if (this.mouse.grabbed) {
        // move selected element
        this.mouse.grabbed.x = this.mouse.grabbedStartingX + (this.mouse.x - this.mouse.clickX);
        this.mouse.grabbed.y = this.mouse.grabbedStartingY + (this.mouse.y - this.mouse.clickY);
      } else {
        // create new game element? Maybe?
      }
    }
    // move camera when mouse wheel is held down
    if (this.mouse.buttons[1]) {
      var scrollDirection = (this.mouse.naturalScrolling) ? 1 : -1;
      this.mouse.grabbed.x = this.mouse.grabbedStartingX - scrollDirection * (this.mouse.x - this.mouse.clickX);
      this.mouse.grabbed.y = this.mouse.grabbedStartingY - scrollDirection * (this.mouse.y - this.mouse.clickY);
    }
  }

  LevelEditor.prototype.updateScene = function () {
    // update objects to be rendered
    this.camera.update();
  };

  LevelEditor.prototype.renderBackground = function (ctx) {
    this.fillCanvas(ctx, "#111");
    ctx.save();
    for (var i = 0; i < this.starCount; i++) {
      var star = this.stars[i];
      ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
      ctx.beginPath();
      ctx.arc(
        (star.x - this.camera.x * 0.3 + this.canvas.width) % this.canvas.width,
        (star.y - this.camera.y * 0.3 + this.canvas.height) % this.canvas.height,
        star.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    }
    ctx.restore();
  };

  LevelEditor.prototype.updateTimeEllapsed = function () {
    this.previousTime = this.currentTime || Date.now();
    this.currentTime = Date.now();
    return (this.currentTime - this.previousTime) / 1000;
  };

  LevelEditor.prototype.clearCanvas = function (ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  LevelEditor.prototype.fillCanvas = function (ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  LevelEditor.prototype.drawGrid = function (ctx) {
    this.grid.draw(ctx);
  }

  LevelEditor.prototype.renderScene = function (ctx) {
    // optimize rendering by only drawing objects that are on screen
    this.drawGrid(ctx);
    for (var i = 0; i < this.drawables.length; i++) {
      var drawable = this.drawables[i];
      drawable.overlaps(this.camera.viewportRect) &&
        drawable.draw(ctx, this.camera);
    }
  };

  LevelEditor.prototype.start = function () {
    this.main();
  };

  LevelEditor.prototype.main = function () {
    dt = this.updateTimeEllapsed();
    // this.handleKeyboard();
    this.handleMouse();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx);
    this.renderScene(this.ctx);

    requestAnimationFrame(this.main.bind(this));
  };

  return LevelEditor;
})();
