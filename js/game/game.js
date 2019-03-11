var Game = (function() {
  function Game() {}

  window.states = {
    PAUSED: "paused",
    RUNNING: "running",
    GAME_OVER: "game over",
    VICTORY: "victory",
    EXIT: 0
  };

  Game.prototype.init = function(config) {
    // go Fullscreen
    document.documentElement.requestFullscreen();

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
    this.gameMenu = new GameMenu();
    this.attachMenuEventHandlers();

    // initialize keyboard & sound
    this.keyboard = keyboardManager.getInstance();
    this.keyboard.init(this);
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
      canvas: this.canvas,
      camera: this.camera,
      mouse: this.mouse
    });

    // ghost
    this.ghost = new Ghost();

    // game timer
    this.timer = new GameTimer({
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30
    });
  };

  Game.prototype.attachMenuEventHandlers = function() {
    this.handleMenuResumeClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.unpause();
    };
    this.handleMenuExitClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.exit();
    };
    this.handleRestartClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.restartGame();
    };
    this.handleControlsButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.gameMenu.showControlsMenu();
    };
    this.handleAboutButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.gameMenu.showAboutMenu();
    };
    this.handleBackButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.state === states.PAUSED && this.gameMenu.showPauseMenu();
      this.state === states.VICTORY && this.gameMenu.showVictoryMenu();
      this.state === states.GAME_OVER && this.gameMenu.showGameOverMenu();
    };
    this.handleLoadMenuClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.gameMenu.showLoadMenu();
    };
    this.gameMenu.resumeButton.onclick = this.handleMenuResumeClick.bind(this);
    this.gameMenu.restartButton.onclick = this.handleRestartClick.bind(this);
    this.gameMenu.controlsButton.onclick = this.handleControlsButtonClick.bind(
      this
    );
    this.gameMenu.aboutButton.onclick = this.handleAboutButtonClick.bind(this);
    this.gameMenu.backButton.onclick = this.handleBackButtonClick.bind(this);
    this.gameMenu.loadButton.onclick = this.handleLoadMenuClick.bind(this);
    this.gameMenu.exitButton.onclick = this.handleMenuExitClick.bind(this);
  };

  Game.prototype.loadGameDataFromLocalStorage = function() {
    var savedData = localStorage.getItem("gameData");
    if (savedData) {
      gameData = JSON.parse(savedData);
    }
  };

  Game.prototype.handleKeyboard = function() {
    var keyboard = this.keyboard;
    var player = this.level.player;

    // do not handle keyboard if player is dead
    if (player.isDead) {
      return;
    }

    player.v.y =
      player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
        ? player.collidingWith[1].v.y
        : player.v.y;
    if (keyboard.RIGHT || keyboard.LEFT) {
      keyboard.LEFT && player.moveLeft();
      keyboard.RIGHT && player.moveRight();
    } else {
      player.v.x =
        player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
          ? player.collidingWith[1].v.x
          : 0;
      player.v.x = player.isColliding[0]
        ? player.collidingWith[0].v.x
        : player.v.x;
    }

    if (keyboard.DOWN) {
      player.GRAVITY_ACCELERATION > 0 ? player.crouch() : player.jump();
    } else {
      player.stand();
    }

    if (keyboard.UP) {
      player.GRAVITY_ACCELERATION > 0 ? player.jump() : player.crouch();
    }

    if (keyboard.SPACE) {
      player.jump();
    }

    if (keyboard.ENTER) {
      if (!player.shield.isAnimating) {
        player.shield.isOpen ? player.shield.close() : player.shield.open();
      }
    }
  };

  Game.prototype.updateScene = function() {
    var player = this.level.player;

    // update objects to be rendered
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
    this.level.lasers.forEach(
      function(laser, index) {
        if (laser.hasReachedMaxRange()) {
          this.collisionManager.destroyLaser(index);
        } else {
          laser.update();
        }
      }.bind(this)
    );
    player.shield.update();
    this.level.platforms.forEach(function(platform) {
      platform.update();
    });
    player.update();

    // update particles
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
    if (!player.isDead && !player.within(this.level.worldRect)) {
      player.die();
    }
    this.camera.update();
  };

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
    this.levelManager.buildEntities();

    // only draw objects in the viewport
    this.level.entities.forEach(
      function(entity) {
        entity.getBoundingRect().overlaps(this.camera) &&
          entity.draw(ctx, camera);
      }.bind(this)
    );
    this.ghost.draw(ctx, camera);
    this.level.particles.forEach(function(particle) {
      particle.draw(ctx, camera);
    });
    this.lifeBar.draw(ctx);
    this.timer.draw(ctx);
    this.shouldDisplayRulers &&
      this.grid.draw(ctx, camera, { isGame: true, shouldDisplayRulers: true });
    this.skillBar.draw(ctx, camera);
  };

  Game.prototype.setBackground = function(path) {
    this.canvas.style.backgroundImage = "url(" + path + ")";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
  };

  Game.prototype.restartGame = function() {
    cancelAnimationFrame(this.rAF);
    this.gameMenu.close();
    this.unpause();
    this.startGame();
  };

  Game.prototype.startGame = function() {
    this.rAF && cancelAnimationFrame(this.rAF);
    this.loadGameDataFromLocalStorage();
    this.level = this.levelManager.buildLevel(this.currentLevelName);
    this.timer.reset.call(this.timer, this.level.countdownStart);
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
    requestAnimationFrame(this.pauseMenuLoop.bind(this));
  };

  Game.prototype.exit = function() {
    show(this.gameMenu.gameIntroEl);
    this.gameMenu.close();
    hide(this.gameMenu.gameContainerEl);
    this.state = states.EXIT;
    delete game;
    document.exitFullscreen();
  };

  Game.prototype.checkVictory = function() {
    if (this.level.skills.length <= 0 && !(this.state === states.GAME_OVER)) {
      this.state = states.VICTORY;
      setTimeout(
        function() {
          this.gameMenu.showVictoryMenu();
        }.bind(this),
        1000
      );
    }
  };

  Game.prototype.checkDefeat = function() {
    if (this.level.player.isDead && !(this.state === states.GAME_OVER)) {
      this.state = states.GAME_OVER;
      setTimeout(
        function() {
          this.gameMenu.showGameOverMenu();
        }.bind(this),
        1000
      );
    }
  };

  Game.prototype.pause = function() {
    if (this.state !== states.GAME_OVER && this.state !== states.VICTORY) {
      !this.gameMenuEl && this.gameMenu.showPauseMenu();
      this.timer.pause();
      this.soundManager.pauseAll();
      this.state = states.PAUSED;
    }
  };

  Game.prototype.unpause = function() {
    this.state !== states.GAME_OVER &&
      this.state !== states.VICTORY &&
      this.gameMenu.close();
    this.timer.play();
    this.soundManager.playPaused();
    this.state = states.RUNNING;
  };

  Game.prototype.requestLoop = function() {
    switch (this.state) {
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.VICTORY:
        this.rAF = requestAnimationFrame(this.gameOverLoop.bind(this));
      default:
        break;
    }
  };

  Game.prototype.mainLoop = function() {
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 2);
    this.ghost.update();
    !this.level.player.isDead &&
      this.timer.countdownStart - this.timer.totalTime < 1000 &&
      this.level.player.die();
    this.handleKeyboard();
    this.level.entities.forEach(function(entity) {
      typeof entity.updateVelocity === "function" && entity.updateVelocity();
    });
    !this.level.player.isDead && this.collisionManager.handleCollisions();
    this.updateScene();
    this.checkVictory();
    this.checkDefeat();
    this.render(this.ctx, this.camera);
    this.requestLoop();
  };

  Game.prototype.pauseMenuLoop = function() {
    this.camera.updateDimensions(); // keep updating camera in case window is resized
    this.render(this.ctx, this.camera);
    this.requestLoop();
  };

  Game.prototype.gameOverLoop = function() {
    this.updateScene();
    this.render(this.ctx, this.camera);
    this.requestLoop();
  };

  Game.prototype.updateDebugInfo = function() {
    var player = this.level.player;
    var camera = this.camera;

    var debugEl = e("div", { class: "debug" }, [
      e("h2", null, "debug info"),
      e("section", { class: "player" }, [
        e("p", null, [
          e("strong", null, "x: "),
          this.level.player.x,
          e("br"),
          e("strong", null, " y: "),
          this.level.player.y
        ]),
        e("p", null, [
          e("strong", null, "width: "),
          this.level.player.width,
          e("br"),
          e("strong", null, " height: "),
          this.level.player.height
        ]),
        e("p", null, [
          e("strong", null, "crouching: "),
          this.level.player.isCrouching
        ]),
        e("p", null, [
          e("strong", null, "speedX: "),
          this.level.player.v.x,
          e("br"),
          e("strong", null, " speedY: "),
          this.level.player.v.y
        ]),
        e("p", null, [
          e("strong", null, "accelX: "),
          this.level.player.acceleration.x,
          e("strong", null, " accelY: "),
          this.level.player.acceleration.y
        ]),
        e("p", null, [
          e("strong", null, "colliding: "),
          this.level.player.isColliding
        ])
      ]),
      e("section", { class: "camera" }, [
        e("p", null, [e("strong", null, "camX: "), this.camera.x]),
        e("p", null, [e("strong", null, "camY: "), this.camera.y])
      ])
    ]);
  };

  return Game;
})();
