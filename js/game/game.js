var Game = (function() {
  function Game(options) {}

  Game.prototype.init = function(config) {
    // config
    if (config) {
      this.shouldDisplayDebug = config.shouldDisplayDebug || false;
      this.shouldDisplayRulers =
        config.shouldDisplayRulers !== undefined
          ? config.shouldDisplayRulers
          : true;
    }

    // time management
    this.timer = new GameTimer();

    // // game state
    // this.state = {
    //   inPauseMenu: false,
    //   inMainMenu: false,
    //   inGame: true
    // };

    // initalize canvas(es)
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    // this.backgroundCanvas = document.getElementById("background");
    // this.bgCtx = this.backgroundCanvas.getContext("2d");

    // keyboard & sound
    this.keyboard = keyboardManager.getInstance();
    this.keyboard.init(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);

    // create level
    worldRect = new AABB(0, -10000, 3000, 2000);
    this.player = new Player(100, -600);
    this.platforms = [
      new Platform(-20, -350, 220, 5),
      new Platform(350, -250, 50, 5),
      new Platform(0, -130, 180, 5),
      new Platform(0, -150, 180, 5),
      new Platform(330, -390, 150, 5),
      new Platform(150, 200, 50, 5),
      new Platform(500, -270, 80, 80),
      new Platform(500, -170, 80, 160),
      new Platform(500, 10, 80, 120),
      new Platform(500, 150, 80, 120),
      new Platform(700, -80, 30, 20),
      new Platform(350, 70, 30, 20),
      new Platform(700, 210, 30, 20),
      new Platform(200, -470, 5, 170),
      new Platform(0, -10000, 0, 20000),
      new MovingPlatform(200, -430, 100, 5, 400, -430, 100),
      new MovingPlatform(700, -400, 80, 30, 700, -100, 100),
      new MovingPlatform(0, -200, 40, 50, 50, 400, 100)
    ];

    // initialize background
    this.canvas.style.backgroundImage =
      "url(./assets/images/background_2000_stars.png";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
    // this.starCount = 500;
    // this.stars = [];
    // for (var i = 0; i < this.starCount; i++) {
    //   this.stars.push({
    //     x: Math.floor(Math.random() * (this.canvas.width + 1)),
    //     y: Math.floor(Math.random() * (this.canvas.height + 1)),
    //     r: Math.random() * 1 + 0.5,
    //     opacity: Math.random() * 0.5 + 0.4
    //   });
    // }

    this.drawables = [];
    this.drawables.push(this.player);
    this.drawables = this.drawables.concat(this.platforms);
    // this.drawables = this.drawables.concat(this.walls);

    var that = this;
    this.player.collidableWith = this.drawables.filter(function(el) {
      return el !== that.player;
    });

    this.camera = new Camera(this);
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
      this.player.GRAVITY_ACCELERATION > 0
        ? this.player.crouch()
        : this.player.jump();
    } else {
      this.player.stand();
    }

    if (this.keyboard.UP) {
      this.player.GRAVITY_ACCELERATION > 0
        ? this.player.jump()
        : this.player.crouch();
    }

    if (this.keyboard.SPACE) {
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
    // update objects to be rendered
    this.player.shield.update();
    for (var i = 0; i < this.platforms.length; i++) {
      var platform = this.platforms[i];
      platform.update();
    }
    this.player.update();
    this.camera.update();
  };

  Game.prototype.renderBackground = function(ctx, camera) {
    // this.fillCanvas(ctx, "#111");
    // ctx.save();
    // for (var i = 0; i < this.starCount; i++) {
    //   var star = this.stars[i];
    //   ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
    //   ctx.beginPath();
    //   ctx.arc(
    //     (star.x - this.camera.x * 0.7 + this.canvas.width) % this.canvas.width,
    //     (star.y - this.camera.y * 0.7 + this.canvas.height) %
    //       this.canvas.height,
    //     star.r,
    //     0,
    //     Math.PI * 2
    //   );
    //   ctx.fill();
    // }
    // ctx.restore();

    this.canvas.style.backgroundPosition =
      -camera.x * 0.502 + "px " + -camera.y * 0.502 + "px";
    // death star
    var deathStar = new Image();
    deathStar.src = "./assets/images/death_star.png";
    ctx.drawImage(
      deathStar,
      1000 - camera.x * 0.5,
      -100 - camera.y * 0.5,
      500,
      500
    );
  };

  Game.prototype.renderScene = function(ctx, camera) {
    this.shouldDisplayRulers && this.drawRulers(ctx, camera);

    // only drawing objects that are in the viewport
    for (var i = 0; i < this.drawables.length; i++) {
      var drawable = this.drawables[i];
      drawable.overlaps(this.camera) && drawable.draw(ctx, camera);
    }

    if (window.md) {
      ctx.save();
      ctx.fillStyle = "yellow";
      ctx.fillRect(md.x - camera.x, md.y - camera.y, md.width, md.height);
      ctx.restore();
    }

    this.timer.draw(ctx);
  };

  Game.prototype.clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.fillCanvas = function(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.drawRulers = function(ctx, camera) {
    var minX = Math.floor(this.camera.left / 100, 2) * 100;
    var maxX = Math.ceil(this.camera.right / 100, 2) * 100;
    var minY = Math.floor(this.camera.top / 100, 2) * 100;
    var maxY = Math.ceil(this.camera.bottom / 100, 2) * 100;

    ctx.save();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = gameData.colors.STAR_WARS_YELLOW; // Star Wars yellow
    ctx.strokeStyle = "white";
    for (var i = minX; i <= maxX; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i - camera.left, 0);
      ctx.lineTo(i - camera.left, 10);
      ctx.stroke();
      ctx.moveTo(i - camera.left, this.canvas.height - 10);
      ctx.lineTo(i - camera.left, this.canvas.height);
      ctx.stroke();

      ctx.fillText(i, i + 10 - camera.left, 20);
      ctx.fillText(i, i + 10 - camera.left, this.canvas.height - 10);
    }
    for (var i = minY; i <= maxY; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i - camera.top);
      ctx.lineTo(10, i - camera.top);
      ctx.stroke();
      ctx.moveTo(this.canvas.width - 10, i - camera.top);
      ctx.lineTo(this.canvas.width, i - camera.top);
      ctx.stroke();

      ctx.fillText(-i, 20, i - camera.top);
      ctx.fillText(-i, this.canvas.width - 50, i - camera.top);
    }
    ctx.restore();
  };

  Game.prototype.pause = function() {
    this.isPaused = true;
    this.timer.pause();
    this.soundManager.pauseAll();

    var gameMenuEl = document.querySelector(".game-menu");
    gameMenuEl.classList.remove("hidden");
  };

  Game.prototype.unpause = function() {
    this.isPaused = false;
    this.timer.play();
    this.soundManager.playPaused();

    var gameMenuEl = document.querySelector(".game-menu");
    gameMenuEl.classList.add("hidden");

    // finally resume game loop
    this.main();
  };

  Game.prototype.getCollidableObjectsInViewport = function() {
    return this.drawables.filter(
      function(box) {
        return box !== this.player && box.overlaps(this.camera);
      }.bind(this)
    );
  };

  Game.prototype.detectCollisions = function() {
    var player = this.player;
    var collidableWith = this.getCollidableObjectsInViewport();
    var collisions = []; // contains objects describing collisions

    // apply gravity acceleration and reset collisions
    player.applyGravity();
    player.isColliding = [0, 0];

    // loop over each collidable object and store collision data
    for (var i = 0; i < collidableWith.length; i++) {
      var box = collidableWith[i];
      md = AABB.minkowskiDifference(box, player);

      // // if no collision detected
      // if (!md.contains(0, 0)) {
      //   console.log("continue");
      //   continue;
      // }

      var relMotion = Vector.subtract(player.v, box.v).multiplyByScalar(dt);
      var colInfo = collision.segmentAABB(new Vector(), relMotion, md);
      var t = colInfo.t;
      var side = colInfo.side;

      if (t < Number.POSITIVE_INFINITY) {
        /*
          REFACTOR THIS SHIT
        */
        player.isColliding[0] = side[0] ? side[0] : player.isColliding[0];
        // player.isColliding[1] = side[1] !== 0 ? side[1] : player.isColliding[1];
        player.isColliding[1] = side[1] * relMotion.y > 0 ? side[1] : 0;

        if (relMotion.y === 0) {
          console.log("STOP\nSTOP\nSTOP\nSTOP\nSTOP");
        }
        if (side[0] * relMotion.x <= 0) {
          player.isColliding[0] = 0;
        }
        if (side[1] * relMotion.y <= 0) {
          player.isColliding[1] = 0;
        }
        /*
          END REFACTOR
        */

        // vertical collision
      }

      // RESOLVE COLLISION HERE
      if (Math.sign(player.GRAVITY_ACCELERATION) === player.isColliding[1]) {
        player.y =
          player.isColliding[1] > 0
            ? box.top - player.height + box.v.y * dt
            : box.bottom + box.v.y * dt;
        player.v.y = box.v.y + player.GRAVITY_ACCELERATION * dt;
        player.v.x += box.v.x;
      }

      // horizontal collision
      if (player.isColliding[0]) {
        player.x =
          player.isColliding[0] < 0
            ? box.right + box.v.x * dt
            : box.left - player.width + box.v.x * dt; // snap
        player.v.x = box.v.x;
      }
      // (HINT: go through all collisions)

      box.touched = player.isColliding[0] || player.isColliding[1];
    }
  };

  Game.prototype.startGame = function() {
    var music = new Sound(
      "./assets/music/Star Wars - John Williams - Duel Of The Fates.mp3",
      1
    );
    setTimeout(function() {
      music.play();
    }, 2000);
    this.main();
  };

  /*
    GAME LOOPS
  */

  // intro loop
  Game.prototype.introLoop = function() {
    requestAnimationFrame(this.intro.bind(this));
  };

  // main game loop
  Game.prototype.main = function() {
    // time management
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 2);
    this.handleKeyboard();
    this.detectCollisions();
    this.updateScene();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

    !this.isPaused && requestAnimationFrame(this.main.bind(this));
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
    collidingEl.innerHTML =
      "<strong>colliding: </strong>" + this.player.isColliding;
    cameraPositionX.innerHTML = "<strong>camX: </strong>" + this.camera.x;
    cameraPositionY.innerHTML = "<strong>camY: </strong>" + this.camera.y;
  };

  return Game;
})();
