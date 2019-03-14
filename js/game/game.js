var Game = (function() {
  function Game(config) {
    // config
    if (config) {
      this.shouldDisplayDebug = config.shouldDisplayDebug || false;
      this.shouldDisplayRulers =
        config.shouldDisplayRulers !== undefined
          ? config.shouldDisplayRulers
          : true;
    }

    // initalize canvas(es) and html elements
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // game menu
    this.gameMenu = new GameMenu({ game: this });

    // initial game state
    this.state = Game.states.PAUSED;

    // initialize keyboard & sound
    this.keyboard = new KeyboardManager(this);
    this.touchInput = new TouchManager(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);

    // initialize level manager
    this.levelManager = levelManager.getInstance();
    this.levelManager.init(this);
    this.currentLevelName = "level 1";

    // camera
    this.camera = new Camera({
      canvas: this.canvas
    });

    // grid
    this.grid = new Grid({
      options: {
        isGame: true,
        shouldDisplayRulers: this.shouldDisplayRulers
      },
      canvas: this.canvas,
      camera: this.camera,
      mouse: this.mouse
    });

    // ghost
    this.ghost = new Ghost();

    // game timer (game inner logic)
    this.timer = new GameTimer({
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30
    });
  }

  Game.states = {
    PAUSED: "paused",
    RUNNING: "running",
    GAME_OVER: "game over",
    VICTORY: "victory",
    EXIT: 0
  };

  Game.prototype.loadGameDataFromLocalStorage = function() {
    var savedData = localStorage.getItem("gameData");
    if (savedData) {
      gameData = JSON.parse(savedData);
    }
  };

  Game.prototype.preload = function() {
    var args = Array.prototype.slice.call(arguments);
    var remainingCount = 0;
    var images;
    var lastArgument = args[args.length - 1];

    if (typeof lastArgument === "function") {
      done = lastArgument;
      remainingCount = args.length - 1;
      images = args.slice(0, args.length - 1);
    } else {
      remainingCount = args.length;
      images = args;
    }

    this.images = {};

    for (var i = 0; i < images.length; i++) {
      var name = args[i].name;
      var source = args[i].source;

      this.images[name] = new Image();
      this.images[name].src = source;
      this.images[name].onload = function() {
        remainingCount--;

        if (remainingCount === 0) {
          done();
        }
      };
    }
  };

  Game.prototype.handleKeyboard = function() {
    var keyboard = this.keyboard;
    var touchInput = this.touchInput;
    var player = this.level.player;

    // do not handle keyboard if player is dead
    if (player.isDead) {
      return;
    }

    player.v.y =
      player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
        ? player.collidingWith[1].v.y
        : player.v.y;

    // player controls
    if (
      keyboard.RIGHT ||
      keyboard.LEFT ||
      touchInput.JOYPAD_RIGHT ||
      touchInput.JOYPAD_LEFT
    ) {
      (keyboard.LEFT || touchInput.JOYPAD_LEFT) && player.moveLeft();
      (keyboard.RIGHT || touchInput.JOYPAD_RIGHT) && player.moveRight();
    } else {
      player.v.x =
        player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
          ? player.collidingWith[1].v.x
          : 0;
      player.v.x = player.isColliding[0]
        ? player.collidingWith[0].v.x
        : player.v.x;
    }

    if (keyboard.DOWN || touchInput.JOYPAD_DOWN) {
      player.GRAVITY_ACCELERATION > 0 ? player.crouch() : player.jump();
    } else {
      player.stand();
    }

    if (keyboard.UP || touchInput.JOYPAD_UP) {
      player.GRAVITY_ACCELERATION > 0 ? player.jump() : player.crouch();
    }

    if (keyboard.SPACE || touchInput.BUTTON_A) {
      player.jump();
    }

    if (keyboard.ENTER || touchInput.BUTTON_B) {
      if (!player.shield.isAnimating) {
        player.shield.isOpen ? player.shield.close() : player.shield.open();
      }
    }

    // camera controls
    if (keyboard.EQUAL) {
      this.camera.zoomIn();
    }

    if (keyboard.MINUS) {
      this.camera.zoomOut();
    }
  };

  Game.prototype.updateScene = function() {
    var player = this.level.player;

    // ghost
    this.ghost.update();

    // ennemies fire new lasers
    !player.isDead &&
      this.level.ennemies.forEach(
        function(ennemy) {
          var distanceVector = Vector.subtract(player.center, ennemy.center);
          if (
            distanceVector.normSquared < Math.pow(ennemy.visionRange, 2) &&
            Date.now() - ennemy.lastFiredAt > ennemy.fireDelay
          ) {
            var direction = distanceVector.getUnitVector();
            this.level.lasers.push(ennemy.attack(direction));
          }
        }.bind(this)
      );

    // lasers
    this.level.lasers.forEach(
      function(laser, index) {
        if (laser.hasReachedMaxRange()) {
          this.collisionManager.destroyLaser(index);
        } else {
          laser.update();
        }
      }.bind(this)
    );

    // shield
    player.shield.update();

    // platforms
    this.level.platforms.forEach(function(platform) {
      platform.update();
    });

    // player
    player.update();

    // particles
    this.level.particles.forEach(
      function(particle, index) {
        if (Date.now() - particle.createdAt > particle.maxLife) {
          this.level.particles.splice(index, 1);
        } else {
          particle.update();
        }
      }.bind(this)
    );

    // kill player if they move outside of the world boundaries
    if (!player.isDead) {
      if (
        !player.within(this.level.worldRect) ||
        this.timer.countdownStart - this.timer.totalTime <= 0
      ) {
        player.die();
      }
    }

    this.camera.update();
  };

  Game.prototype.setBackground = function(path) {
    this.canvas.style.backgroundImage = "url(" + path + ")";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
  };

  Game.prototype.exit = function() {
    show(this.gameMenu.gameIntroEl);
    this.gameMenu.close();
    hide(this.gameMenu.gameContainerEl);
    this.state = Game.states.EXIT;
    delete game;
  };

  Game.prototype.pause = function() {
    if (
      this.state !== Game.states.GAME_OVER &&
      this.state !== Game.states.VICTORY
    ) {
      !this.gameMenuEl && this.gameMenu.showPauseMenu();
      this.timer.pause();
      this.soundManager.pauseAll();
      this.state = Game.states.PAUSED;
    }
  };

  Game.prototype.unpause = function() {
    this.state !== Game.states.GAME_OVER &&
      this.state !== Game.states.VICTORY &&
      this.gameMenu.close();
    this.timer.play();
    this.soundManager.playPaused();
    this.state = Game.states.RUNNING;
  };

  Game.prototype.displaySplash = function() {
    var splash = document.getElementById("splash");
    splash.classList.remove("hidden");
  };

  Game.prototype.hideSplash = function() {
    var splash = document.getElementById("splash");
    splash.classList.add("hidden");
  };

  Game.prototype.start = function() {
    this.displaySplash();
    setTimeout(
      function() {
        this.preload(
          { name: "htmlLogo", source: "assets/images/html-5-icon.png" },
          { name: "cssLogo", source: "assets/images/css-3-icon.png" },
          { name: "bootstrapLogo", source: "assets/images/bootstrap-logo.png" },
          { name: "jqueryLogo", source: "assets/images/jquery-logo.png" },
          { name: "sassLogo", source: "assets/images/sass-logo.png" },
          { name: "nodeLogo", source: "assets/images/nodejs-logo.png" },
          { name: "angularLogo", source: "assets/images/angular-logo.svg" },
          { name: "reactLogo", source: "assets/images/react-logo.png" },
          { name: "mongoLogo", source: "assets/images/mongodb-logo.png" },
          { name: "meteorLogo", source: "assets/images/meteor-logo.png" },
          {
            name: "background",
            source: "assets/images/background_2000_stars.png"
          },
          function() {
            this.hideSplash();
            this.pause();
            this.loadGameDataFromLocalStorage();
            this.init();
            this.main();
          }.bind(this)
        );
      }.bind(this),
      1500
    );
  };

  Game.prototype.restart = function() {
    this.gameMenu.close();
    this.unpause();

    this.init();
    this.main();
  };

  Game.prototype.init = function() {
    this.level = this.levelManager.buildLevel(this.currentLevelName);
    this.timer.reset(this.level.countdownStart);
    this.levelManager.buildEntities();
    this.collisionManager = new CollisionManager({
      level: this.level,
      timer: this.timer,
      camera: this.camera
    });
    this.ghost.init({
      timer: this.timer,
      player: this.level.player
    });
    this.setBackground("./assets/images/background_2000_stars.png");
    this.camera.follow(
      this.level.player,
      (this.canvas.width - this.level.player.width) / 2 - 10,
      (this.canvas.height - this.level.player.height) / 2 - 10
    );
    this.lifeBar = new LifeBar({
      x: 60,
      y: 40,
      width: 200,
      height: 15,
      gameObject: this.level.player
    });
    this.skillBar = new SkillBar({
      player: this.level.player,
      skills: this.level.skills
    });

    this.raf && cancelAnimationFrame(this.raf);
  };

  Game.prototype.main = function() {
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 4);

    switch (this.state) {
      case Game.states.RUNNING:
        this.handleKeyboard();
        this.collisionManager.handleCollisions();
        this.updateScene();
        this.checkVictory();
        this.checkDefeat();
        break;

      case Game.states.PAUSED:
        this.camera.updateDimensions();
        break;

      case Game.states.GAME_OVER:
      case Game.states.VICTORY:
        this.updateScene();
        break;

      default:
        break;
    }

    this.render(this.ctx, this.camera);

    this.raf = requestAnimationFrame(this.main.bind(this));
  };

  Game.prototype.checkVictory = function() {
    if (
      this.level.skills.length <= 0 &&
      !(this.state === Game.states.GAME_OVER)
    ) {
      this.state = Game.states.VICTORY;
      this.level.player.v = new Vector(); // stop player
      setTimeout(
        function() {
          this.gameMenu.showVictoryMenu();
        }.bind(this),
        1000
      );
    }
  };

  Game.prototype.checkDefeat = function() {
    if (this.level.player.isDead && !(this.state === Game.states.GAME_OVER)) {
      this.state = Game.states.GAME_OVER;
      setTimeout(
        function() {
          this.gameMenu.showGameOverMenu();
        }.bind(this),
        1000
      );
    }
  };

  // rendering
  Game.prototype.render = function(ctx, camera) {
    this.clearCanvas(ctx);
    this.renderBackground(ctx, camera);
    this.renderScene(ctx, camera);
  };

  Game.prototype.clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.renderBackground = function(ctx, camera) {
    this.canvas.style.backgroundPosition =
      -camera.x * 0.502 + "px " + -camera.y * 0.502 + "px";
  };

  Game.prototype.renderScene = function(ctx, camera) {
    this.levelManager.buildEntities([this.ghost].concat(this.level.particles));
    this.uiElements = [
      // this.lifeBar,
      this.timer,
      this.grid,
      this.skillBar
    ];

    // only draw objects in the viewport
    this.level.entities.forEach(function(entity) {
      entity.draw(ctx, camera);
    });

    // UI
    this.uiElements.forEach(function(uiElement) {
      uiElement.draw(ctx, camera);
    });
  };

  // debug display
  Game.prototype.updateDebugInfo = function() {
    var uiContainerEl = document.getElementById("ui-container");
    var debugEl = h(
      "div",
      { class: "debug" },
      h("h2", null, "debug info"),
      h(
        "section",
        { class: "player" },
        h(
          "p",
          null,
          h("strong", null, "x: "),
          this.level.player.x,
          h("br"),
          h("strong", null, " y: "),
          this.level.player.y
        ),
        h(
          "p",
          null,
          h("strong", null, "width: "),
          this.level.player.width,
          h("br"),
          h("strong", null, " height: "),
          this.level.player.height
        ),
        h(
          "p",
          null,
          h("strong", null, "crouching: "),
          this.level.player.isCrouching
        ),
        h(
          "p",
          null,
          h("strong", null, "speedX: "),
          this.level.player.v.x,
          h("br"),
          h("strong", null, " speedY: "),
          this.level.player.v.y
        ),
        h(
          "p",
          null,
          h("strong", null, "accelX: "),
          this.level.player.acceleration.x,
          h("strong", null, " accelY: "),
          this.level.player.acceleration.y
        ),
        h(
          "p",
          null,
          h("strong", null, "colliding: "),
          this.level.player.isColliding
        )
      ),
      h(
        "section",
        { class: "camera" },
        h("p", null, [h("strong", null, "camX: "), this.camera.x]),
        h("p", null, [h("strong", null, "camY: "), this.camera.y])
      )
    );

    uiContainerEl.appendChild(render(debugEl));
  };

  return Game;
})();
