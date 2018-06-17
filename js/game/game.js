var Game = (function() {
  function Game() {}

  window.states = {
    PAUSED: "paused",
    RUNNING: "running",
    INTRO: "intro",
    GAME_OVER: "game over",
    VICTORY: "victory",
    EXIT: 0
  };

  Game.prototype.init = function(config) {
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
    this.attachEventHandlers();

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
      worldRect: this.worldRect,
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
  };

  Game.prototype.setBackground = function(path) {
    this.canvas.style.backgroundImage = "url(" + path + ")";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
  };

  Game.prototype.attachEventHandlers = function() {
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

  Game.prototype.buildGameLevel = function(levelName) {
    this.level = this.levelManager.buildLevel(levelName);
    if (this.level !== null) {
      this.worldRect = this.level.worldRect;
      this.player = this.level.player;
      this.platforms = this.level.platforms;
      this.ennemies = this.level.ennemies;
      this.skills = this.level.skills;
    }

    // temporary objects
    this.lasers = [];
    this.particles = [];
  };

  Game.prototype.buildGameObjects = function() {
    this.gameObjects = []
      .concat(this.platforms)
      .concat(this.skills)
      .concat(this.ennemies)
      .concat(this.lasers)
      .concat([this.player]);
  };

  Game.prototype.handleKeyboard = function() {
    var keyboard = this.keyboard;
    var player = this.player;

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
    var player = this.player;

    // update objects to be rendered
    !player.isDead &&
      this.ennemies.forEach(
        function(ennemy) {
          var distanceVector = Vector.subtract(player.center, ennemy.center);
          if (
            distanceVector.normSquared < Math.pow(ennemy.visionRange, 2) &&
            Date.now() - ennemy.lastFiredAt > ennemy.fireDelay
          ) {
            var direction = distanceVector.getUnitVector();
            this.lasers.push(ennemy.attack(direction));
          }
        }.bind(this)
      );
    this.lasers.forEach(
      function(laser, index) {
        if (laser.hasReachedMaxRange()) {
          this.destroyLaser(index);
        } else {
          laser.update();
        }
      }.bind(this)
    );
    player.shield.update();
    this.platforms.forEach(function(platform) {
      platform.update();
    });
    player.update();

    // update particles
    this.particles.forEach(
      function(particle, index) {
        if (Date.now() - particle.createdAt > particle.maxLife) {
          this.particles.splice(index, 1);
        }
        particle.update();
      }.bind(this)
    );

    // kill player if they move outside of the world boundaries
    if (!player.isDead && !player.within(this.worldRect)) {
      player.die();
    }
    this.camera.update();
  };

  Game.prototype.renderBackground = function(ctx, camera) {
    this.canvas.style.backgroundPosition =
      -camera.x * 0.502 + "px " + -camera.y * 0.502 + "px";
  };

  Game.prototype.renderScene = function(ctx, camera) {
    this.buildGameObjects();

    // only draw objects in the viewport
    this.gameObjects.forEach(
      function(obj) {
        obj.getBoundingRect().overlaps(this.camera) && obj.draw(ctx, camera);
      }.bind(this)
    );
    this.ghost.draw(ctx, camera);
    this.particles.forEach(function(particle) {
      particle.draw(ctx, camera);
    });
    this.lifeBar.draw(ctx);
    this.timer.draw(ctx);
    this.shouldDisplayRulers &&
      this.grid.draw(ctx, camera, { isGame: true, shouldDisplayRulers: true });
    this.skillBar.draw(ctx, camera);
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

  Game.prototype.destroyLaser = function(index) {
    this.lasers.splice(index, 1);
  };

  Game.prototype.handleCollisions = function() {
    this.handleCollisionsWithPlatforms();
    this.handleCollisionsWithSkills();
    this.handleCollisionsWithLasers();
  };

  Game.prototype.handleCollisionsWithLasers = function() {
    var playerBox = this.player.getBoundingRect();
    var shieldBox = this.player.shield.getBoundingRect();
    !this.player.shield.isOpen
      ? this.lasers.forEach(
          function(laser, index) {
            var laserBox = laser.getBoundingRect();
            if (physics.collision.AABBWithAABB(playerBox, laserBox)) {
              if (
                playerBox.contains(laser.A.x, laser.A.y) ||
                playerBox.contains(laser.B.x, laser.B.y) ||
                physics.collision.segmentAABB(laser.A, laser.B, playerBox) <
                  Number.POSITIVE_INFINITY
              ) {
                this.player.applyDamage(laser.damage);
                this.player.hitPoints <= 0 && this.player.die();
                this.particles.push(
                  hitParticles(
                    laser.B.x,
                    laser.B.y,
                    Vector.subtract(laser.A, laser.B),
                    "red"
                  )
                );
                this.player.hitParticles = hitParticles;
                this.destroyLaser(index);
              }
            }
          }.bind(this)
        )
      : this.lasers.forEach(
          function(laser, index) {
            var laserBox = laser.getBoundingRect();
            if (this.player.shield.hasCollisionWithLaser(laser)) {
              this.destroyLaser(index);
            }
          }.bind(this)
        );
  };

  Game.prototype.handleCollisionsWithSkills = function() {
    var playerBox = this.player.getBoundingRect();
    this.skills.forEach(
      function(skill, index) {
        var skillBox = skill.getBoundingRect();
        if (physics.collision.AABBWithAABB(playerBox, skillBox)) {
          this.player.skills.push(skill);
          this.timer.countdownStart += 5 * 1000; // add 5s to timer
          this.skills.splice(index, 1);
        }
      }.bind(this)
    );
  };

  Game.prototype.getCollidablePlatformsInViewport = function() {
    return this.gameObjects.filter(
      function(gameObject) {
        var box = gameObject.getBoundingRect();
        if (box !== this.player) {
          box.touched = false;
          box.overlaps(this.camera);
          return true;
        }
        return false;
      }.bind(this)
    );
  };

  Game.prototype.getCollisions = function(collidableGameObjects) {
    var player = this.player;
    var collisions = [];

    // loop over each collidable object and store collision data
    collidableGameObjects.forEach(function(box) {
      var md = AABB.minkowskiDifference(box, player);
      // window.md = md; // remove this when everything's working
      var relMotion = Vector.subtract(player.v, box.v).multiplyByScalar(dt);
      var colInfo = physics.collision.segmentAABB(new Vector(), relMotion, md);
      var t = colInfo.t;
      var side = colInfo.side;

      // create array of all collisions for that frame
      if (t < Number.POSITIVE_INFINITY) {
        var d = side[0] ? relMotion.x * side[0] : relMotion.y * side[1];
        // If there is a collision along one of the axes,
        // add collision to the array of collision characteristics
        d > 0 &&
          collisions.push({
            side: side,
            box: box,
            d: d
          });
      }
    });
    return collisions;
  };

  Game.prototype.handleCollisionsWithPlatforms = function() {
    var player = this.player;
    var collidableWith = this.getCollidablePlatformsInViewport();
    var collisions;
    var boxH = null,
      boxV = null;

    // apply gravity acceleration and reset collisions
    player.applyGravity();
    player.isColliding = [0, 0];
    collisions = this.getCollisions(collidableWith);

    /**
     * COLLISION RESOLUTION
     **/

    // determine FINAL COLLISION characteristics
    var dH = 0,
      dV = 0;
    collisions.forEach(function(collision) {
      var side = collision.side;
      var d = collision.d;
      var box = collision.box;

      // die if player has double sided collision
      if (
        side[0] * player.isColliding[0] < 0 ||
        side[1] * player.isColliding[1] < 0
      ) {
        player.die();
        return;
      }

      // set player collisions [0, 1] + [-1, 0] -> [-1, 1]
      if (box.solid) {
        player.isColliding[0] = side[0] ? side[0] : player.isColliding[0];
        if (box.passthrough) {
          player.isColliding[1] =
            side[1] * player.GRAVITY_ACCELERATION > 0
              ? side[1]
              : player.isColliding[1];
        } else {
          player.isColliding[1] = side[1] ? side[1] : player.isColliding[1];
        }
      }

      // if new value of d is greater than the old one then the new box is the one in contact with the player
      if (side[0]) {
        if (d > dH) {
          dH = d;
          boxH = box;
        }
      } else if (side[1]) {
        if (d > dV) {
          dV = d;
          boxV = box;
        }
      }
    });

    // resolve horizontal collision
    if (player.isColliding[0]) {
      player.x =
        player.isColliding[0] > 0
          ? toFixedPrecision(boxH.left + boxH.v.x * dt - player.width, 2) // snap
          : toFixedPrecision(boxH.right + boxH.v.x * dt, 2);
    }
    // resolve vertical collision
    if (player.isColliding[1]) {
      player.y =
        player.isColliding[1] > 0
          ? toFixedPrecision(boxV.top + boxV.v.y * dt - player.height, 2)
          : toFixedPrecision(boxV.bottom + boxV.v.y * dt, 2);
    }

    // inform the player about which objects it's colliding with
    player.collidingWith = [boxH, boxV];
    if (boxH) {
      boxH.touched = true;
    }
    if (boxV) {
      boxV.touched = true;
    }
  };

  Game.prototype.restartGame = function() {
    cancelAnimationFrame(this.rAF);
    this.gameMenu.close();
    this.unpause();
    this.startGame();
  };

  Game.prototype.startGame = function() {
    this.rAF && cancelAnimationFrame(this.rAF);

    // game state
    this.loadGameDataFromLocalStorage();
    this.buildGameLevel(this.currentLevelName);

    // game timer
    this.timer = new GameTimer({
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30,
      countdownStart: this.level.countdownStart
    });

    // game objects
    this.buildGameObjects();

    // player ghost
    this.ghost.init({
      timer: this.timer,
      player: this.player
    });

    // background
    this.setBackground("./assets/images/background_2000_stars.png");

    // camera
    this.camera.follow(
      this.player,
      (this.canvas.width - this.player.width) / 2 - 10,
      (this.canvas.height - this.player.height) / 2 - 10
    );
    this.lifeBar = new LifeBar({
      x: 60,
      y: 40,
      width: 200,
      height: 15,
      gameObject: this.player
    });
    this.skillBar = new SkillBar({
      player: this.player,
      skills: this.skills
    });
    requestAnimationFrame(this.pauseMenuLoop.bind(this));
  };

  Game.prototype.exit = function() {
    show(this.gameMenu.gameIntroEl);
    this.gameMenu.close();
    hide(this.gameMenu.gameContainerEl);
    this.state = states.EXIT;
    delete game;
  };

  Game.prototype.checkVictory = function() {
    if (this.skills.length <= 0 && !(this.state === states.GAME_OVER)) {
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
    if (this.player.isDead && !(this.state === states.GAME_OVER)) {
      this.state = states.GAME_OVER;
      setTimeout(
        function() {
          this.gameMenu.showGameOverMenu();
        }.bind(this),
        1000
      );
    }
  };

  Game.prototype.introLoop = function() {
    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
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

  Game.prototype.requestLoop = function() {
    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
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
    // time management
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 2);

    // ghost
    this.ghost.update();

    // kill player if countdown is finished
    !this.player.isDead &&
      this.timer.countdownStart - this.timer.totalTime < 1000 &&
      this.player.die();

    // keyboard
    this.handleKeyboard();

    for (var i = 0; i < this.gameObjects.length; i++) {
      var drawable = this.gameObjects[i];
      typeof drawable.updateVelocity === "function" &&
        drawable.updateVelocity();
    }

    !this.player.isDead && this.handleCollisions();
    this.updateScene();
    this.checkVictory();
    this.checkDefeat();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

    this.requestLoop();
  };

  Game.prototype.pauseMenuLoop = function() {
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.camera.updateDimensions(); // continue updating camera in case browser window is resized
    this.renderScene(this.ctx, this.camera);

    this.requestLoop();
  };

  Game.prototype.gameOverLoop = function() {
    this.updateScene();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

    this.requestLoop();
  };

  Game.prototype.updateDebugInfo = function() {
    var player = this.player;
    var camera = this.camera;

    var debugEl = e("div", { class: "debug" }, [
      e("h2", null, "debug info"),
      e("section", { class: "player" }, [
        e("p", null, [
          e("strong", null, "x: "),
          this.player.x,
          e("br"),
          e("strong", null, " y: "),
          this.player.y
        ]),
        e("p", null, [
          e("strong", null, "width: "),
          this.player.width,
          e("br"),
          e("strong", null, " height: "),
          this.player.height
        ]),
        e("p", null, [
          e("strong", null, "crouching: "),
          this.player.isCrouching
        ]),
        e("p", null, [
          e("strong", null, "speedX: "),
          this.player.v.x,
          e("br"),
          e("strong", null, " speedY: "),
          this.player.v.y
        ]),
        e("p", null, [
          e("strong", null, "accelX: "),
          this.player.acceleration.x,
          e("strong", null, " accelY: "),
          this.player.acceleration.y
        ]),
        e("p", null, [
          e("strong", null, "colliding: "),
          this.player.isColliding
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
