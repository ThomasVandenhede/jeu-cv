var GameMenu = require("./gameMenu");
var CollisionManager = require("./collisionManager");
var LevelManager = require("./levelManager");
var LifeBar = require("./lifebar");
var SkillBar = require("./skillBar");
var Ghost = require("./ghost");
var Clock = require("./clock");
var ClockDisplay = require("./clockDisplay");
var utils = require("../utils");
window.gameData = require("./gameData.json");

var Game = (function() {
  function Game(config) {
    SDK.Game.call(this, config);

    // config
    if (config) {
      if (config.displayDebug) {
        this.debugIntervalID = setInterval(function() {
          game.updateDebugInfo();
        }, 50);
      }
      this.displayRulers =
        config.displayRulers !== undefined ? config.displayRulers : true;
    }

    // game menu
    this.gameMenu = new GameMenu({ game: this });

    // initial game state
    this.state = Game.states.PAUSED;

    // initialize level manager
    this.levelManager = new LevelManager({ data: gameData, app: this });
    this.currentLevelName = "level 1";

    // grid
    this.grid = new SDK.Grid({
      options: {
        isGame: true,
        displayRulers: this.displayRulers
      },
      canvas: this.canvas,
      camera: this.camera,
      mouse: this.mouse
    });

    // ghost
    this.ghost = new Ghost();

    // clock / timer
    this.clock = new Clock();
    this.clockDisplay = new ClockDisplay({
      game: this,
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30
    });
  }

  Game.prototype = Object.create(SDK.Game.prototype);
  Game.prototype.constructor = Game;

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

    // increase player's horizontal speed based on user input
    if (keyboard.keys.ArrowRight.isPressed || touchInput.JOYPAD_RIGHT) {
      player.moveRight();
    }
    if (keyboard.keys.ArrowLeft.isPressed || touchInput.JOYPAD_LEFT) {
      player.moveLeft();
    }

    // jump
    if (
      (keyboard.keys.ArrowDown.isPressed || touchInput.JOYPAD_DOWN) &&
      player.GRAVITY_ACCELERATION < 0
    ) {
      player.jump();
    }

    if (
      (keyboard.keys.ArrowUp.isPressed || touchInput.JOYPAD_UP) &&
      player.GRAVITY_ACCELERATION > 0
    ) {
      player.jump();
    }

    if (keyboard.keys.Space.isPressed || touchInput.BUTTON_A) {
      player.jump();
    }

    // shield
    if (keyboard.keys.Enter.isPressed || touchInput.BUTTON_B) {
      if (!player.shield.isAnimating) {
        player.shield.isOpen ? player.shield.close() : player.shield.open();
      }
    }

    // camera controls
    if (keyboard.keys.Equal.isPressed) {
      this.camera.zoomIn();
    }

    if (keyboard.keys.Minus.isPressed) {
      this.camera.zoomOut();
    }
  };

  Game.prototype.update = function() {
    if (this.state === Game.states.RUNNING) {
      // Order matters!
      // First detect collisions and resolve player's position and speed.
      // Then, handle keyboard and increase player's speed.
      this.runPhysics();
      this.handleKeyboard();
    }

    if (this.state === Game.states.PAUSED) {
      this.camera.updateDimensions();
      return;
    }

    var player = this.level.player;

    // ghost
    this.ghost.update();

    // ennemies fire new lasers
    !player.isDead &&
      this.level.ennemies.forEach(function(ennemy) {
        var distanceVector = SDK.Vector.subtract(player.center, ennemy.center);
        if (
          distanceVector.normSquared < Math.pow(ennemy.visionRange, 2) &&
          Date.now() - ennemy.lastFiredAt > ennemy.fireDelay
        ) {
          var direction = distanceVector.getUnitVector();
          this.level.lasers.push(ennemy.attack(direction));
        }
      }, this);

    // lasers
    this.level.lasers.forEach(function(laser, index) {
      if (laser.hasReachedMaxRange()) {
        this.collisionManager.destroyLaser(index);
      } else {
        laser.update();
      }
    }, this);

    // shield
    player.shield.update();

    // platforms
    this.level.platforms.forEach(function(platform) {
      platform.update();
    });

    // player
    player.update();

    // particles
    this.level.particles.forEach(function(particle, index) {
      if (Date.now() - particle.createdAt > particle.maxLife) {
        this.level.particles.splice(index, 1);
      } else {
        particle.update();
      }
    }, this);

    // kill player if they move outside of the world boundaries
    if (!player.isDead) {
      if (
        !player.within(this.level.worldRect) ||
        this.clock.timeRemaining <= 0
      ) {
        player.die();
      }
    }

    this.camera.update();
    if (
      this.state !== Game.states.GAME_OVER &&
      this.state !== Game.states.VICTORY
    ) {
      this.clock.update();
      this.checkVictory();
      this.checkDefeat();
    }
  };

  Game.prototype.setBackground = function(path) {
    this.canvas.style.backgroundImage = "url(" + path + ")";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
  };

  Game.prototype.pauseLoop = function() {
    this.frame && cancelAnimationFrame(this.frame);
    this.frame = null;
  };

  Game.prototype.exit = function() {
    this.pauseLoop();
    this.gameMenu.close();
    utils.hide(this.gameMenu.gameContainerEl);
    this.state = Game.states.EXIT;
    this.keyboard.unbindEventHandlers();
    this.touchInput.unbindEventHandlers();
    delete game;
  };

  Game.prototype.pause = function() {
    if (
      this.state !== Game.states.GAME_OVER &&
      this.state !== Game.states.VICTORY
    ) {
      !this.gameMenuEl && this.gameMenu.showPauseMenu();
      this.clock.pause();
      this.soundManager.pauseAll();
      this.state = Game.states.PAUSED;
    }
  };

  Game.prototype.unpause = function() {
    this.state !== Game.states.GAME_OVER &&
      this.state !== Game.states.VICTORY &&
      this.gameMenu.close();
    this.clock.play();
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
          {
            name: "smoke",
            source: "assets/images/smoke2.png"
          },
          function() {
            this.hideSplash();
            this.pause();
            this.loadGameDataFromLocalStorage();
            this.init();
            this.step();
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
    this.step();
  };

  Game.prototype.init = function() {
    this.level = this.levelManager.buildLevel(this.currentLevelName);
    this.clock.reset(this.level.countdownStart);
    this.timer.reset();
    this.levelManager.buildEntities();
    this.collisionManager = new CollisionManager({
      level: this.level,
      clock: this.clock,
      camera: this.camera
    });
    this.ghost.init({
      clock: this.clock,
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

    // create keyboard event bindings
    this.keyboard.keys.Pause.onDown = function() {
      if (!this.keyboard.keys.Pause.repeat) {
        this.state === "running" ? this.pause() : this.unpause();
      }
    };

    this.keyboard.keys.KeyG.onDown = function() {
      if (!this.keyboard.keys.KeyG.repeat) {
        this.level.player.reverseGravity();
      }
    };

    this.pauseLoop();
  };

  Game.prototype.runPhysics = function() {
    this.level.player.applyGravity();
    this.collisionManager.handleCollisions();
  };

  Game.prototype.checkVictory = function() {
    if (
      this.level.skills.length <= 0 &&
      !(this.state === Game.states.GAME_OVER)
    ) {
      this.clock.pause();
      this.state = Game.states.VICTORY;
      this.level.player.v = new SDK.Vector(); // stop player
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
      this.clock.pause();
      this.state = Game.states.GAME_OVER;
      setTimeout(
        function() {
          this.gameMenu.showGameOverMenu();
        }.bind(this),
        1500
      );
    }
  };

  // rendering
  Game.prototype.render = function(ctx, camera) {
    this.clearCanvas(ctx);
    this.renderBackground(ctx, camera);
    this.renderScene(ctx, camera);
    this.renderUI(ctx, camera);
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

    // only draw objects in the viewport
    this.level.entities.forEach(function(entity) {
      entity.draw(ctx, camera);
    });
  };

  Game.prototype.renderUI = function(ctx, camera) {
    this.uiElements = [
      // this.lifeBar,
      this.clockDisplay,
      this.grid,
      this.skillBar
    ];

    // UI
    this.uiElements.forEach(function(uiElement) {
      uiElement.draw(ctx, camera);
    });
  };

  // debug display
  Game.prototype.updateDebugInfo = function() {
    var debugContainerEl = document.getElementById("debug-container");
    utils.emptyElement(debugContainerEl);
    if (this.level) {
      var debugEl = utils.h(
        "div",
        { class: "debug" },
        utils.h("h2", null, "debug info"),
        utils.h(
          "section",
          { class: "player" },
          utils.h(
            "p",
            null,
            utils.h("strong", null, "x: "),
            this.level.player.x,
            utils.h("br"),
            utils.h("strong", null, " y: "),
            this.level.player.y
          ),
          utils.h(
            "p",
            null,
            utils.h("strong", null, "width: "),
            this.level.player.width,
            utils.h("br"),
            utils.h("strong", null, " height: "),
            this.level.player.height
          ),
          utils.h(
            "p",
            null,
            utils.h("strong", null, "crouching: "),
            this.level.player.isCrouching
          ),
          utils.h(
            "p",
            null,
            utils.h("strong", null, "speedX: "),
            this.level.player.v.x,
            utils.h("br"),
            utils.h("strong", null, " speedY: "),
            this.level.player.v.y
          ),
          utils.h(
            "p",
            null,
            utils.h("strong", null, "accelX: "),
            this.level.player.acceleration.x,
            utils.h("strong", null, " accelY: "),
            this.level.player.acceleration.y
          ),
          utils.h(
            "p",
            null,
            utils.h("strong", null, "colliding: "),
            this.level.player.isColliding
          )
        ),
        utils.h(
          "section",
          { class: "camera" },
          utils.h("p", null, [
            utils.h("strong", null, "camX: "),
            this.camera.x
          ]),
          utils.h("p", null, [utils.h("strong", null, "camY: "), this.camera.y])
        )
      );
      debugContainerEl.appendChild(utils.render(debugEl));
    }
  };

  return Game;
})();

module.exports = Game;
