var Game = (function() {
  function Game(options) {}

  Game.prototype.init = function(config) {
    this.debug = config.debug || false;
    this.rulers = config.rulers !== undefined ? config.rulers : true;
    this.previousTime;
    this.currentTime;
    this.canvas = document.getElementById("canvas");
    this.backgroundCanvas = document.getElementById("background");
    this.ctx = this.canvas.getContext("2d");
    this.bgCtx = this.backgroundCanvas.getContext("2d");
    this.keyboard = keyboardManager.getInstance();
    worldRect = new Rectangle(0, -100000, 3000, 102000);
    this.player = playerFactory(100, -600);
    this.platforms = [
      platformFactory(0, -350, 200, 5),
      platformFactory(350, -250, 50, 5),
      platformFactory(0, -130, 180, 5),
      platformFactory(0, -150, 180, 5),
      platformFactory(330, -400, 150, 5),
      platformFactory(150, 200, 50, 5),
      platformFactory(500, -270, 80, 80),
      platformFactory(500, -170, 80, 160),
      platformFactory(500, 10, 80, 120),
      platformFactory(500, 150, 80, 120),
      platformFactory(700, -80, 30, 20),
      platformFactory(350, 70, 30, 20),
      platformFactory(700, 210, 30, 20),
      platformFactory(0, -100000, 1, 200000)
    ];

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

    this.drawables = [];
    this.drawables.push(this.player);
    this.drawables = this.drawables.concat(this.platforms);

    this.player.collidableWith = this.drawables.filter(function(el) {
      return el !== this.player;
    });

    this.camera = new Camera(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      2000,
      2000
    );
    this.camera.follow(
      this.player,
      (this.canvas.width - this.player.width) / 2 - 10,
      (this.canvas.height - this.player.height) / 2 - 10
    );
  };

  Game.prototype.handleKeyboard = function() {
    if (this.keyboard.RIGHT || this.keyboard.LEFT) {
      this.keyboard.LEFT && this.player.moveLeft();
      this.keyboard.RIGHT && this.player.moveRight();
    } else {
      this.player.v.x = 0;
    }

    if (this.keyboard.DOWN) {
      this.player.crouch();
    } else {
      this.player.stand();
    }

    if (this.keyboard.UP || this.keyboard.SPACE) {
      this.player.jump();
    }

    if (this.keyboard.ENTER) {
      if (!this.player.shield.isAnimating) {
        this.player.shield.isOpen
          ? this.player.shield.close()
          : this.player.shield.open();
      }
    }
  };

  Game.prototype.updateScene = function() {
    // apply gravity and resolve collisions
    this.player.applyGravity();
    this.player.detectCollisions();
    // update objects to be rendered
    this.player.update(dt);
    this.player.shield.update(dt);
    for (var i = 0; i < this.platforms.length; i++) {
      var platform = this.platforms[i];
      platform.update(dt);
    }
    this.camera.update();
  };

  Game.prototype.updateTimeEllapsed = function() {
    this.previousTime = this.currentTime || Date.now();
    this.currentTime = Date.now();
    return (this.currentTime - this.previousTime) / 1000;
  };

  Game.prototype.renderBackground = function(ctx) {
    this.fillCanvas(ctx, "#111");
    ctx.save();
    for (var i = 0; i < this.starCount; i++) {
      var star = this.stars[i];
      ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
      ctx.beginPath();
      ctx.arc(
        (star.x - this.camera.x + this.canvas.width) % this.canvas.width,
        (star.y - this.camera.y + this.canvas.height) % this.canvas.height,
        star.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    }
    ctx.restore();
  };

  Game.prototype.clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.fillCanvas = function(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.drawRulers = function(ctx) {
    var minX,
      maxX,
      minY,
      maxY,
      crossSize = 3;
    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#ffd700"; // Star Wars yellow
    ctx.strokeStyle = "white";
    minX = Math.floor(this.camera.x / 100, 2) * 100;
    maxX = Math.ceil((this.camera.x + this.camera.wView) / 100, 2) * 100;
    for (var i = minX; i <= maxX; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i - this.camera.x, 0);
      ctx.lineTo(i - this.camera.x, 10);
      ctx.stroke();
      ctx.moveTo(i - this.camera.x, this.canvas.height - 10);
      ctx.lineTo(i - this.camera.x, this.canvas.height);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(i, i + 10 - this.camera.x, 20);
      ctx.fillText(i, i + 10 - this.camera.x, this.canvas.height - 10);
    }
    minY = Math.floor(this.camera.y / 100, 2) * 100;
    maxY = Math.ceil((this.camera.y + this.camera.hView) / 100, 2) * 100;
    for (var i = minY; i <= maxY; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i - this.camera.y);
      ctx.lineTo(10, i - this.camera.y);
      ctx.stroke();
      ctx.moveTo(this.canvas.width - 10, i - this.camera.y);
      ctx.lineTo(this.canvas.width, i - this.camera.y);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(-i, 20, i - this.camera.y);
      ctx.fillText(-i, this.canvas.width - 50, i - this.camera.y);
    }
    for (var i = minX + 100; i <= maxX - 100; i += 100) {
      for (var j = minY + 100; j <= maxY - 100; j += 100) {
        ctx.beginPath();
        ctx.moveTo(i - crossSize - this.camera.x, j - this.camera.y);
        ctx.lineTo(i + crossSize - this.camera.x, j - this.camera.y);
        ctx.moveTo(i - this.camera.x, j - crossSize - this.camera.y);
        ctx.lineTo(i - this.camera.x, j + crossSize - this.camera.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
    ctx.restore();
  };

  Game.prototype.renderScene = function(ctx) {
    this.rulers && this.drawRulers(ctx);

    // optimize rendering by only drawing objects that are on screen
    for (var i = 0; i < this.drawables.length; i++) {
      var drawable = this.drawables[i];
      drawable.overlaps(this.camera.viewportRect) &&
        drawable.draw(ctx, this.camera);
    }
  };

  Game.prototype.start = function() {
    var music = new Sound(
      "./assets/music/Star Wars - John Williams - Duel Of The Fates.mp3",
      0.3
    );
    setTimeout(() => {
      music.play();
    }, 2000);
    this.main();
  };

  Game.prototype.main = function() {
    dt = this.updateTimeEllapsed();
    this.handleKeyboard();
    this.updateScene();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx);
    this.renderScene(this.ctx);

    requestAnimationFrame(this.main.bind(this));
  };

  Game.prototype.updateDebugInfo = function() {
    var debug = document.querySelector(".debug");
    var positionEl = debug.querySelector(".player__position");
    var sizeEl = debug.querySelector(".player__size");
    var isCrouchingEl = debug.querySelector(".player__is-crouching");
    var speedEl = debug.querySelector(".player__speed");
    var accelerationEl = debug.querySelector(".player__acceleration");
    var collidingEl = debug.querySelector(".player__is-colliding");
    var cameraPositionX = debug.querySelector(".camera__positionX");
    var cameraPositionY = debug.querySelector(".camera__positionY");

    var collidingHTML = Object.keys(this.player.isColliding)
      .filter(
        function(key) {
          return this.player.isColliding[key];
        }.bind(this)
      )
      .join(" ");

    positionEl.innerHTML =
      "<strong>x: </strong>" +
      this.player.x +
      "<br />" +
      " <strong>y: </strong>" +
      this.player.y;
    sizeEl.innerHTML =
      "<strong>width: </strong>" +
      this.player.width +
      " <strong>height: </strong>" +
      this.player.height;
    isCrouchingEl.innerHTML =
      "<strong>crouching: </strong>" + this.player.isCrouching;
    speedEl.innerHTML =
      "<strong>speedX: </strong>" +
      this.player.v.x +
      "<br />" +
      " <strong>speedY: </strong>" +
      this.player.v.y;
    accelerationEl.innerHTML =
      "<strong>accelX: </strong>" +
      this.player.acceleration.x +
      " <strong>accelY: </strong>" +
      this.player.acceleration.y;
    collidingEl.innerHTML = "<strong>colliding: </strong>" + collidingHTML;
    cameraPositionX.innerHTML = "<strong>camX: </strong>" + this.camera.x;
    cameraPositionY.innerHTML = "<strong>camY: </strong>" + this.camera.y;
  };

  return Game;
})();
