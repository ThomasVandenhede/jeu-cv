var Game = (function() {
  function Game(props) {}

  var states = {
    PAUSED: "paused",
    RUNNING: "running",
    INTRO: "intro",
    GAME_OVER: "",
    VICTORY: "",
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

    // game state
    this.state = states.RUNNING;

    // initalize canvas(es) and html elements
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.gameMenuEl = document.querySelector(".game-menu");
    hide(this.gameMenuEl);
    this.canvasContainerEl = document.getElementById("canvas-container");
    this.gameIntroEl = document.getElementById("game-intro");
    this.gameOverEl = document.getElementById("game-over");
    this.gameOverMessageEl = document.getElementById("game-over-message");
    this.gameOverSubmessageEl = document.getElementById("game-over-submessage");

    // keyboard & sound
    this.keyboard = keyboardManager.getInstance();
    this.keyboard.init(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);

    // attach event handlers for game menu
    this.attachEventHandlers();

    // load local storage data
    this.loadGameDataFromLocalStorage();

    // create level
    worldRect = new AABB({ x: 0, y: -2000, width: 3000, height: 4000 });
    this.player = new Player({ x: 10, y: -500 });
    this.platforms = [
      new Platform({ x: -20, y: -400, width: 220, height: 10 }),
      new Platform({ x: 350, y: -250, width: 50, height: 10 }),
      new Platform({
        x: 0,
        y: -130,
        width: 180,
        height: 10,
        passthrough: true
      }),
      new Platform({
        x: 0,
        y: -150,
        width: 180,
        height: 10,
        passthrough: true
      }),
      new Platform({
        x: 330,
        y: -390,
        width: 150,
        height: 10,
        passthrough: true
      }),
      new Platform({ x: 150, y: 200, width: 50, height: 10 }),
      new Platform({ x: 500, y: -270, width: 80, height: 80 }),
      new Platform({ x: 480, y: -170, width: 120, height: 160 }),
      new Platform({
        x: 500,
        y: 10,
        width: 80,
        height: 120,
        passthrough: true
      }),
      new Platform({
        x: 480,
        y: 180,
        width: 120,
        height: 120,
        passtarough: true
      }),
      new Platform({ x: 700, y: -80, width: 30, height: 20 }),
      new Platform({ x: 350, y: 70, width: 30, height: 20, passthrough: true }),
      new Platform({
        x: 700,
        y: 210,
        width: 30,
        height: 20,
        passthrough: true
      }),
      new Platform({ x: 200, y: -470, width: 10, height: 170 }),
      new Platform({ x: 0, y: -10000, width: 0, height: 20000 }),
      new Platform({
        x: 0,
        y: -500,
        width: 400,
        height: 10,
        passthrough: true
      }),
      new Platform({ x: 0, y: -600, width: 100, height: 100 }),
      new Platform({ x: 400, y: -600, width: 100, height: 100 }),
      new Platform({
        x: 100,
        y: -600,
        width: 400,
        height: 10,
        passthrough: true
      }),
      new Platform({ x: 0, y: -700, width: 200, height: 100 }),
      new Platform({ x: 500, y: -700, width: 100, height: 100 }),
      new Platform({
        x: 200,
        y: -700,
        width: 400,
        height: 10,
        passthrough: true
      }),
      new Platform({ x: 0, y: -800, width: 100, height: 100 }),
      new Platform({ x: 400, y: -800, width: 100, height: 100 }),
      new Platform({
        x: 100,
        y: -800,
        width: 400,
        height: 10,
        passthrough: true
      }),
      new Platform({
        x: 0,
        y: -900,
        width: 300,
        height: 10,
        passthrough: true
      }),
      new Platform({ x: 300, y: -900, width: 100, height: 100 }),
      new MovingPlatform(200, -430, 100, 10, 400, -430, 100, {
        passthrough: true
      }),
      new MovingPlatform(700, -400, 80, 30, 700, -100, 100, {
        passthrough: true
      }),
      new MovingPlatform(0, -200, 200, 50, 30, 400, 100),
      new Platform({ x: 800, y: -500, width: 500, height: 10 }),
      new MovingPlatform(950, -800, 50, 200, 950, -700, 200),
      new MovingPlatform(1050, -800, 50, 200, 1050, -700, 200),
      new MovingPlatform(1150, -800, 50, 200, 1150, -700, 200),
      new MovingPlatform(100, -600, 100, 100, 300, -600, 100),
      new MovingPlatform(850, -400, 150, 10, 1250, -400, 200)
    ];
    this.skills = [
      new Skill(350, -570, 50, 50, "./assets/images/html-5-icon.png"),
      new Skill(500, -600, 50, 50, "./assets/images/css-3-icon.png"),
      new Skill(1000, -600, 50, 50, "./assets/images/jquery-logo.png"),
      new Skill(200, 0, 50, 50, "./assets/images/mongodb-logo.png"),
      new Skill(500, -200, 50, 50, "./assets/images/react-logo.png"),
      new Skill(1300, -600, 50, 50, "./assets/images/angular-logo.svg"),
      new Skill(10, -880, 50, 50, "./assets/images/meteor-logo.png"),
      new Skill(830, 50, 50, 50, "./assets/images/sass-logo.png"),
      new Skill(20, -350, 50, 50, "./assets/images/bootstrap-logo.png"),
      new Skill(1000, -450, 50, 50, "./assets/images/nodejs-logo.png")
    ];
    this.ennemies = [
      new Ennemy(450, -650),
      new Ennemy(120, -750),
      new Ennemy(900, -700),
      new Ennemy(1250, -700),
      new Ennemy(320, -970),
      new Ennemy(900, -300),
      new Ennemy(850, -300),
      new Ennemy(950, -300),
      new Ennemy(300, -250),
      new Ennemy(300, 250),
      new Ennemy(20, -100),
      new Ennemy(650, -500)
    ];

    // temporary objects
    this.lasers = [];
    this.particles = [];

    // game objects
    this.gameObjects = []
      .concat(this.platforms)
      .concat(this.skills)
      .concat(this.ennemies)
      .concat(this.lasers)
      .concat([this.player]);

    // background
    this.canvas.style.backgroundImage =
      "url(./assets/images/background_2000_stars.png";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";

    // camera
    this.camera = new Camera(this);
    this.camera.follow(
      this.player,
      (this.canvas.width - this.player.width) / 2 - 10,
      (this.canvas.height - this.player.height) / 2 - 10
    );

    // UI
    this.timer = new GameTimer({
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30
    });
    this.lifeBar = new LifeBar({
      x: 60,
      y: 40,
      width: 200,
      height: 15,
      gameObject: this.player
    });
  };

  Game.prototype.attachEventHandlers = function() {
    this.MenuResumeButton = document.getElementById("resume");
    this.MenuLevelButton = document.getElementById("load-level");
    this.MenuAboutButton = document.getElementById("about");
    this.MenuExitButton = document.getElementById("exit");
    this.MenuExitButton2 = document.getElementById("exit2");
    this.MenuRestartButton = document.getElementById("restart");
    this.handleMenuResumeClick = function(e) {
      e.preventDefault();
      this.unpause();
    };
    this.handleMenuLevelClick = function(e) {
      e.preventDefault();
    };
    this.handleMenuAboutClick = function(e) {
      e.preventDefault();
    };
    this.handleMenuExitClick = function(e) {
      e.preventDefault();
      this.exit();
    };
    this.handleRestartClick = function(e) {
      e.preventDefault();
      hide(this.gameOverEl);
      cancelAnimationFrame(this.rAF);
      this.init();
      this.startGame();
    };
    this.MenuResumeButton.onclick = this.handleMenuResumeClick.bind(this);
    this.MenuLevelButton.onclick = this.handleMenuLevelClick.bind(this);
    this.MenuAboutButton.onclick = this.handleMenuAboutClick.bind(this);
    this.MenuExitButton.onclick = this.handleMenuExitClick.bind(this);
    this.MenuExitButton2.onclick = this.handleMenuExitClick.bind(this);
    this.MenuRestartButton.onclick = this.handleRestartClick.bind(this);
  };

  Game.prototype.loadGameDataFromLocalStorage = function() {
    var savedData = localStorage.getItem("gameData");
    if (savedData) {
      gameData = JSON.parse(savedData);
    }
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

  Game.prototype.displaySkills = function(ctx, camera) {
    var acquiredSkillsCount = this.player.skills.length;
    var totalSkillsCount = acquiredSkillsCount + this.skills.length;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(
      60,
      100,
      100,
      100 + ((acquiredSkillsCount + (acquiredSkillsCount % 2)) / 2) * 45
    );
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "16px arial";
    ctx.fillText("Skills", 110, 130);
    ctx.fillText(acquiredSkillsCount + " / " + totalSkillsCount, 110, 160);
    this.player.skills.forEach(
      function(skill, index) {
        ctx.drawImage(
          skill.image,
          70 + (index % 2) * 45,
          200 + ((index - (index % 2)) / 2) * 45,
          30,
          30
        );
      }.bind(this)
    );
    ctx.restore();
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
    if (!player.isDead && !player.within(worldRect)) {
      player.die();
    }
    this.camera.update();
  };

  Game.prototype.renderBackground = function(ctx, camera) {
    this.canvas.style.backgroundPosition =
      -camera.x * 0.502 + "px " + -camera.y * 0.502 + "px";
  };

  Game.prototype.renderScene = function(ctx, camera) {
    this.gameObjects = []
      .concat(this.platforms)
      .concat(this.skills)
      .concat(this.ennemies)
      .concat(this.lasers)
      .concat([this.player]);

    // only draw objects in the viewport
    this.gameObjects.forEach(
      function(obj) {
        obj.getBoundingRect().overlaps(this.camera) && obj.draw(ctx, camera);
      }.bind(this)
    );
    this.particles.forEach(function(particle) {
      particle.draw(ctx, camera);
    });
    this.lifeBar.draw(ctx);
    this.timer.draw(ctx);
    this.shouldDisplayRulers && this.drawRulers(ctx, camera);
    this.displaySkills(ctx, camera);
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
    this.state = states.PAUSED;
    this.timer.pause();
    this.soundManager.pauseAll();
    show(this.gameMenuEl);
  };

  Game.prototype.unpause = function() {
    this.state = states.RUNNING;
    this.timer.play();
    this.soundManager.playPaused();
    hide(this.gameMenuEl);
  };

  Game.prototype.destroyLaser = function(index) {
    this.lasers.splice(index, 1);
  };

  Game.prototype.destroyParticleSet = function(index) {
    this.particleSet;
  };

  Game.prototype.detectCollisions = function() {
    this.detectCollisionsWithPlatforms();
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
                  Math.POSITIVE_INFINITY
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
          this.timer.countDownStart += 5 * 1000; // add 5s to timer
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

  Game.prototype.detectCollisionsWithPlatforms = function() {
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
    // // no collision detected, do nothing
    // if (!collisions.length) {
    //   return;
    // }

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

  Game.prototype.startGame = function() {
    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      default:
        break;
    }
  };

  Game.prototype.exit = function() {
    show(this.gameIntroEl);
    hide(this.gameOverEl);
    hide(this.canvasContainerEl);
    this.state = states.EXIT;
    delete game;
  };

  Game.prototype.checkVictory = function() {
    if (this.skills.length <= 0 && !(this.state === states.GAME_OVER)) {
      this.state = states.VICTORY;
      setTimeout(
        function() {
          this.gameOverMessageEl.innerHTML = "GAGNÉ !";
          this.gameOverSubmessageEl.innerHTML =
            "Vous avez retrouvé toutes mes principales compétences, vous pouvez avoir plus d'infos en consultant mon cv détaillé <a href='./assets/files/CV Thomas Vandenhede.pdf'>ici</a>. Ou bien essayez de battre votre score.";
          show(this.gameOverEl);
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
          this.gameOverMessageEl.innerHTML = "PERDU";
          this.gameOverSubmessageEl.innerHTML = "";
          show(this.gameOverEl);
        }.bind(this),
        1000
      );
    }
  };

  /**
   * Intro loop
   */
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

  /**
   * Main game loop
   */
  Game.prototype.mainLoop = function() {
    // time management
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 2);

    // kill player if countdown is finished
    !this.player.isDead &&
      this.timer.countDownStart - this.timer.totalTime < 1000 &&
      this.player.die();

    // keyboard
    this.handleKeyboard();

    //
    for (var i = 0; i < this.gameObjects.length; i++) {
      var drawable = this.gameObjects[i];
      typeof drawable.updateVelocity === "function" &&
        drawable.updateVelocity();
    }

    !this.player.isDead && this.detectCollisions();
    this.updateScene();
    this.checkVictory();
    this.checkDefeat();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

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

  /**
   * Pause menu loop
   */
  Game.prototype.pauseMenuLoop = function() {
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

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

  Game.prototype.gameOverLoop = function() {
    this.updateScene();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

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
