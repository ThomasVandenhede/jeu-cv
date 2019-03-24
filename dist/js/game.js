/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/game/clock.js":
/*!**************************!*\
  !*** ./js/game/clock.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Clock = (function() {
  function Clock(props) {
    // reference to game object
    SDK.Rectangle.call(this, props);
    this.DANGER_COUNTDOWN_TIME = 5000;
    this.isPaused = false;
    this.isCountDown = true;
    this.timerEl = document.getElementById("gameclock");
  }

  Clock.prototype = Object.create(SDK.Rectangle.prototype);
  Clock.prototype.constructor = Clock;

  Clock.prototype.pause = function() {
    this.isPaused = true;
  };

  Clock.prototype.play = function() {
    this.isPaused = false;
    this.currentTime = Date.now();
  };

  Clock.prototype.update = function() {
    if (!this.isPaused) {
      this.previousTime = this.currentTime;
      this.currentTime = Date.now();
      this.totalTime += this.currentTime - this.previousTime;
    }
  };

  Clock.prototype.reset = function(timestamp) {
    this.totalTime = 0;
    this.currentTime = Date.now();
    this.previousTime = this.currentTime;
    this.countdownStart = timestamp || 0.5 * 60 * 1000; // ms;
  };

  Clock.prototype.getTimerText = function() {
    var displayTime = new Date();
    this.isCountDown
      ? displayTime.setTime(Math.max(0, this.countdownStart - this.totalTime))
      : displayTime.setTime(this.totalTime);
    var milliseconds = displayTime.getMilliseconds();
    var seconds = displayTime.getSeconds();
    var minutes = displayTime.getMinutes();

    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0") +
      ":" +
      milliseconds
        .toString()
        .padStart(3, "0")
        .substring(0, 2)
    );
  };

  // update html element instead of drawing to the canvas
  Clock.prototype.draw = function() {
    var timerText = this.getTimerText();

    if (this.timerEl.textContent !== timerText) {
      if (
        this.isCountDown &&
        this.countdownStart - this.totalTime < this.DANGER_COUNTDOWN_TIME
      ) {
        this.timerEl.classList.add("danger");
      } else {
        this.timerEl.classList.contains("danger") &&
          this.timerEl.classList.remove("danger");
      }
      this.timerEl.innerHTML = timerText;
    }
  };

  return Clock;
})();

module.exports = Clock;


/***/ }),

/***/ "./js/game/collisionManager.js":
/*!*************************************!*\
  !*** ./js/game/collisionManager.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var particleEmitters = __webpack_require__(/*! ./particleEmitters */ "./js/game/particleEmitters.js");

function CollisionManager(props) {
  this.level = props.level;
  this.clock = props.clock;
  this.camera = props.camera;
}

CollisionManager.prototype.handleCollisions = function() {
  this.handleCollisionsWithPlatforms();
  this.handleCollisionsWithSkills();
  this.handleCollisionsWithLasers();
};

CollisionManager.prototype.handleCollisionsWithLasers = function() {
  var playerBox = this.level.player.getBoundingRect();
  !this.level.player.shield.isOpen
    ? this.level.lasers.forEach(function(laser, index) {
        var laserBox = laser.getBoundingRect();
        if (SDK.physics.collision.AABBWithAABB(playerBox, laserBox)) {
          if (
            playerBox.contains(laser.A.x, laser.A.y) ||
            playerBox.contains(laser.B.x, laser.B.y) ||
            SDK.physics.collision.segmentAABB(laser.A, laser.B, playerBox) <
              Number.POSITIVE_INFINITY
          ) {
            this.level.player.applyDamage(laser.damage);
            this.level.player.hitPoints <= 0 && this.level.player.die();
            this.level.particles.push(
              particleEmitters.hitParticles(
                laser.B.x,
                laser.B.y,
                SDK.Vector.subtract(laser.A, laser.B),
                "red"
              )
            );
            this.destroyLaser(index);
          }
        }
      }, this)
    : this.level.lasers.forEach(function(laser, index) {
        if (this.level.player.shield.hasCollisionWithLaser(laser)) {
          this.destroyLaser(index);
        }
      }, this);
};

CollisionManager.prototype.destroyLaser = function(index) {
  this.level.lasers.splice(index, 1);
};

// player acquires skill, no collision to resolve, skills simply disappears
CollisionManager.prototype.handleCollisionsWithSkills = function() {
  var playerBox = this.level.player.getBoundingRect();
  this.level.skills.forEach(function(skill, index) {
    var skillBox = skill.getBoundingRect();
    if (SDK.physics.collision.AABBWithAABB(playerBox, skillBox)) {
      this.level.player.skills.push(skill);
      this.clock.countdownStart += 5 * 1000; // add 5s to clock
      this.level.skills.splice(index, 1);
    }
  }, this);
};

CollisionManager.prototype.getCollidablePlatformsInViewport = function() {
  return this.level.platforms.filter(function(platform) {
    var box = platform.getBoundingRect();
    box.touched = false;
    return box.overlaps(this.camera);
  }, this);
};

CollisionManager.prototype.getCollisions = function(collidableGameObjects) {
  var player = this.level.player;
  var collisions = [];

  // loop over each collidable object and store collision data
  collidableGameObjects.forEach(function(box) {
    var md = SDK.Rectangle.minkowskiDifference(box, player);
    // window.md = md; // remove this when everything's working
    var relMotion = SDK.Vector.subtract(player.v, box.v).scale(dt);
    var colInfo = SDK.physics.collision.segmentAABB(
      new SDK.Vector(),
      relMotion,
      md
    );
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

CollisionManager.prototype.handleCollisionsWithPlatforms = function() {
  var player = this.level.player;
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

module.exports = CollisionManager;


/***/ }),

/***/ "./js/game/ennemy.js":
/*!***************************!*\
  !*** ./js/game/ennemy.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Laser = __webpack_require__(/*! ./laser */ "./js/game/laser.js");

var Ennemy = (function() {
  function Ennemy(x, y) {
    SDK.Circle.call(this, x, y, 10);

    this.v = new SDK.Vector();
    this.solid = false;
    this.damage = 5; // damage the ennemy's attack inflicts
    this.fireDelay = 500; // number of ms between two ennemy attacks
    this.visionRange = 300;
    this.attackRange = 500;
    this.lasers = [];
    this.lastFiredAt = Number.NEGATIVE_INFINITY;
  }

  Ennemy.prototype = Object.create(SDK.Circle.prototype);
  Ennemy.prototype.constructor = Ennemy;

  Ennemy.prototype.attack = function(direction) {
    var center = this.center;
    this.lastFiredAt = Date.now();
    return new Laser({
      x: center.x,
      y: center.y,
      direction: direction,
      damage: this.damage,
      range: this.attackRange,
      color: "lightgrey"
    });
  };

  Ennemy.prototype.update = function() {};

  Ennemy.prototype.updateVelocity = function() {};

  Ennemy.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.r),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  };

  return Ennemy;
})();

module.exports = Ennemy;


/***/ }),

/***/ "./js/game/game.js":
/*!*************************!*\
  !*** ./js/game/game.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var GameMenu = __webpack_require__(/*! ./gameMenu */ "./js/game/gameMenu.js");
var CollisionManager = __webpack_require__(/*! ./collisionManager */ "./js/game/collisionManager.js");
var LevelManager = __webpack_require__(/*! ./levelManager */ "./js/game/levelManager.js");
var LifeBar = __webpack_require__(/*! ./lifebar */ "./js/game/lifebar.js");
var SkillBar = __webpack_require__(/*! ./skillBar */ "./js/game/skillBar.js");
var Ghost = __webpack_require__(/*! ./ghost */ "./js/game/ghost.js");
var Clock = __webpack_require__(/*! ./clock */ "./js/game/clock.js");
window.gameData = __webpack_require__(/*! ./gameData.json */ "./js/game/gameData.json");

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
    this.keyboard = new SDK.KeyboardManager(this);
    this.touchInput = new SDK.TouchManager(this);
    this.soundManager = new SDK.SoundManager(gameData);

    // initialize level manager
    this.levelManager = new LevelManager({ data: gameData, app: this });
    this.currentLevelName = "level 1";

    // camera
    this.camera = new SDK.Camera({
      canvas: this.canvas
    });

    // grid
    this.grid = new SDK.Grid({
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
    this.timer = new SDK.GameTimer();

    this.clock = new Clock({
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

  Game.prototype.update = function() {
    if (this.state === Game.states.RUNNING) {
      this.handleKeyboard();
      this.runPhysics();
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
        this.clock.countdownStart - this.clock.totalTime <= 0
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
    show(this.gameMenu.gameIntroEl);
    this.gameMenu.close();
    hide(this.gameMenu.gameContainerEl);
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

    this.pauseLoop();
  };

  Game.prototype.step = function() {
    this.timer.update();
    dt = this.timer.dt;

    this.update();
    this.render(this.ctx, this.camera);

    this.frame = requestAnimationFrame(this.step.bind(this));
  };

  Game.prototype.runPhysics = function() {
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
      this.clock,
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

module.exports = Game;


/***/ }),

/***/ "./js/game/gameData.json":
/*!*******************************!*\
  !*** ./js/game/gameData.json ***!
  \*******************************/
/*! exports provided: constants, colors, sounds, musics, levels, default */
/***/ (function(module) {

module.exports = {"constants":{"GRAVITY_ACCELERATION":1600},"colors":{"STAR_WARS_YELLOW":"#ffd700"},"sounds":{"location":"./assets/sounds/","files":[{"filename":"Hit 1.mp4","volume":0.2},{"filename":"Hit 2.mp4","volume":0.2},{"filename":"Light swing 1.mp4","volume":1},{"filename":"Light swing 1.mp4","volume":1},{"filename":"Medium hum.mp4","volume":0.15},{"filename":"Open.mp3","volume":0.4},{"filename":"Close.mp3","volume":0.6},{"filename":"impactsplat03.mp3.flac","volume":0.8}]},"musics":{"location":"./assets/music/","files":[{"filename":"Star Wars - John Williams - Duel Of The Fates.mp3","volume":1}]},"levels":{"test level":{"name":"test level","countdownStart":5000,"cssBackground":{"src":"./assets/images/background_1000_stars.png","size":"800px 600px"},"worldRect":{"props":{"x":-1000,"y":-2000,"width":5000,"height":8000}},"player":{"type":"Player","props":{"x":10,"y":-200,"color":"red"}},"platforms":[{"type":"Platform","props":{"x":0,"y":-350,"width":200,"height":5}},{"type":"Platform","props":{"x":350,"y":-250,"width":50,"height":5}},{"type":"Platform","props":{"x":0,"y":-130,"width":180,"height":5}},{"type":"Platform","props":{"x":0,"y":-150,"width":180,"height":5}},{"type":"Platform","props":{"x":330,"y":-400,"width":150,"height":5}},{"type":"Platform","props":{"x":150,"y":200,"width":50,"height":5}},{"type":"Platform","props":{"x":500,"y":-270,"width":80,"height":80}},{"type":"Platform","props":{"x":600,"y":-500,"width":400,"height":20}}],"ennemies":[],"skills":[{"type":"SkillHtml","props":{"x":350,"y":-570,"width":50,"height":50}},{"type":"SkillCss","props":{"x":500,"y":-600,"width":50,"height":50}},{"type":"SkillJquery","props":{"x":1000,"y":-600,"width":50,"height":50}},{"type":"SkillMongo","props":{"x":200,"y":0,"width":50,"height":50}}]},"level 1":{"name":"level 1","countdownStart":15000,"cssBackground":{"src":"./assets/images/background_1000_stars.png","size":"800px 600px"},"worldRect":{"props":{"x":0,"y":-2000,"width":3000,"height":3000}},"player":{"type":"Player","props":{"x":10,"y":-500}},"platforms":[{"type":"Platform","props":{"x":-20,"y":-400,"width":220,"height":10}},{"type":"Platform","props":{"x":350,"y":-250,"width":50,"height":10}},{"type":"Platform","props":{"x":0,"y":-130,"width":180,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-150,"width":180,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":330,"y":-390,"width":150,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":150,"y":200,"width":50,"height":10}},{"type":"Platform","props":{"x":500,"y":-270,"width":80,"height":80}},{"type":"Platform","props":{"x":480,"y":-170,"width":120,"height":160}},{"type":"Platform","props":{"x":500,"y":10,"width":80,"height":120,"passthrough":true}},{"type":"Platform","props":{"x":480,"y":180,"width":120,"height":120,"passtarough":true}},{"type":"Platform","props":{"x":700,"y":-80,"width":30,"height":20}},{"type":"Platform","props":{"x":350,"y":70,"width":30,"height":20,"passthrough":true}},{"type":"Platform","props":{"x":700,"y":210,"width":30,"height":20,"passthrough":true}},{"type":"Platform","props":{"x":200,"y":-470,"width":10,"height":170}},{"type":"Platform","props":{"x":0,"y":-10000,"width":0,"height":20000}},{"type":"Platform","props":{"x":0,"y":-500,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-600,"width":100,"height":100}},{"type":"Platform","props":{"x":400,"y":-600,"width":100,"height":100}},{"type":"Platform","props":{"x":100,"y":-600,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-700,"width":200,"height":100}},{"type":"Platform","props":{"x":500,"y":-700,"width":100,"height":100}},{"type":"Platform","props":{"x":200,"y":-700,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-800,"width":100,"height":100}},{"type":"Platform","props":{"x":400,"y":-800,"width":100,"height":100}},{"type":"Platform","props":{"x":100,"y":-800,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-900,"width":300,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":300,"y":-900,"width":100,"height":100}},{"type":"MovingPlatform","props":{"x":200,"y":-430,"width":100,"height":10,"xEnd":400,"yEnd":-430,"speed":100}},{"type":"MovingPlatform","props":{"x":700,"y":-400,"width":80,"height":30,"xEnd":700,"yEnd":-100,"speed":100,"passthrough":true}},{"type":"MovingPlatform","props":{"x":0,"y":-200,"width":200,"height":50,"xEnd":30,"yEnd":400,"speed":100}},{"type":"Platform","props":{"x":800,"y":-500,"width":500,"height":10}},{"type":"MovingPlatform","props":{"x":950,"y":-800,"width":50,"height":200,"xEnd":950,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":1050,"y":-800,"width":50,"height":200,"xEnd":1050,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":1150,"y":-800,"width":50,"height":200,"xEnd":1150,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":100,"y":-600,"width":100,"height":100,"xEnd":300,"yEnd":-600,"speed":100}},{"type":"MovingPlatform","props":{"x":850,"y":-400,"width":150,"height":10,"xEnd":1250,"yEnd":-400,"speed":200}}],"ennemies":[{"type":"Ennemy","props":{"x":450,"y":-650}},{"type":"Ennemy","props":{"x":120,"y":-750}},{"type":"Ennemy","props":{"x":900,"y":-700}},{"type":"Ennemy","props":{"x":1250,"y":-700}},{"type":"Ennemy","props":{"x":320,"y":-970}},{"type":"Ennemy","props":{"x":900,"y":-300}},{"type":"Ennemy","props":{"x":850,"y":-300}},{"type":"Ennemy","props":{"x":950,"y":-300}},{"type":"Ennemy","props":{"x":300,"y":-250}},{"type":"Ennemy","props":{"x":300,"y":250}},{"type":"Ennemy","props":{"x":20,"y":-100}},{"type":"Ennemy","props":{"x":650,"y":-500}}],"skills":[{"type":"SkillHtml","props":{"x":350,"y":-570,"width":50,"height":50}},{"type":"SkillCss","props":{"x":500,"y":-600,"width":50,"height":50}},{"type":"SkillJquery","props":{"x":1000,"y":-600,"width":50,"height":50}},{"type":"SkillMongo","props":{"x":200,"y":0,"width":50,"height":50}},{"type":"SkillReact","props":{"x":500,"y":-200,"width":50,"height":50}},{"type":"SkillAngular","props":{"x":1300,"y":-600,"width":50,"height":50}},{"type":"SkillMeteor","props":{"x":10,"y":-880,"width":50,"height":50}},{"type":"SkillSass","props":{"x":830,"y":50,"width":50,"height":50}},{"type":"SkillBootstrap","props":{"x":20,"y":-350,"width":50,"height":50}},{"type":"SkillNode","props":{"x":1000,"y":-450,"width":50,"height":50}}]}}};

/***/ }),

/***/ "./js/game/gameMenu.js":
/*!*****************************!*\
  !*** ./js/game/gameMenu.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function GameMenu(props) {
  this.game = props.game;

  this.gameContainerEl = document.getElementById("game-container");
  this.uiContainerEl = document.getElementById("ui-container");
  this.gameIntroEl = document.getElementById("game-intro");

  // MENU BUTTONS
  this.resumeButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.documentElement.requestFullscreen &&
            document.documentElement.requestFullscreen();
          this.game.unpause();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "REPRENDRE"
    )
  );

  this.restartButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.documentElement.requestFullscreen &&
            document.documentElement.requestFullscreen();
          this.game.restart();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "RECOMMENCER"
    )
  );

  this.controlsButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showControlsMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "CONTRÔLES"
    )
  );

  this.aboutButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showAboutMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "À PROPOS"
    )
  );

  this.backButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.game.state === this.game.constructor.states.PAUSED &&
            this.showPauseMenu();
          this.game.state === this.game.constructor.states.VICTORY &&
            this.showVictoryMenu();
          this.game.state === this.game.constructor.states.GAME_OVER &&
            this.showGameOverMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "RETOUR"
    )
  );

  this.loadButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showLoadMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "CHARGER UN NIVEAU"
    )
  );

  this.editorButtonVNode = h(
    "li",
    { class: "game-menu__item" },
    h(
      "a",
      { href: "./level-editor.html", class: "game-menu__link" },
      "OUVRIR L'ÉDITEUR"
    )
  );

  this.exitButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.exitFullscreen =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;

          document.exitFullscreen && document.exitFullscreen();

          this.game.exit();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "QUITTER LE JEU"
    )
  );
}

GameMenu.prototype.showMenu = function(vNode) {
  this.close();
  this.uiContainerEl.appendChild(render(vNode));
};

GameMenu.prototype.showGameOverMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "PERDU !"),
      h(
        "ul",
        { class: "game-menu__list" },
        this.restartButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showVictoryMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "VICTOIRE !"),
      h(
        "p",
        null,
        "Vous avez retrouvé toutes mes principales compétences, vous pouvez avoir plus d'infos en consultant mon cv détaillé ",
        h("a", { href: "./assets/files/CV Thomas Vandenhede.pdf" }, "ici"),
        ". Ou bien essayez de battre votre score."
      ),
      h(
        "ul",
        { class: "game-menu__list" },
        this.restartButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showPauseMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "JEU EN PAUSE"),
      h(
        "ul",
        { class: "game-menu__list" },
        this.resumeButtonVNode,
        this.restartButtonVNode,
        this.controlsButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.aboutButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showControlsMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "CONTRÔLES"),
      h(
        "ul",
        { class: "game-menu__list" },
        h(
          "div",
          { class: "controls-container" },
          h(
            "table",
            { class: "controls" },
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "\u2190"),
                " / ",
                h("span", { class: "kbd" }, "\u2192"),
                " ou ",
                h("span", { class: "kbd" }, "Q"),
                " / ",
                h("span", { class: "kbd" }, "D")
              ),
              h("td", null, "Se déplacer horizontalement")
            ),
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "\u2191"),
                " ou ",
                h("span", { class: "kbd" }, "Espace"),
                " ou ",
                h("span", { class: "kbd" }, "Z")
              ),
              h("td", null, "Sauter")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "\u21b2")),
              h("td", null, "Ouvrir le bouclier")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "Échap")),
              h("td", null, "Afficher cet écran")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "F11")),
              h("td", null, "Plein écran")
            ),
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "+"),
                " / ",
                h("span", { class: "kbd" }, ")")
              ),
              h("td", null, "Zoomer / Dézoomer")
            )
          )
        ),
        this.backButtonVNode
      )
    )
  );
};

GameMenu.prototype.showAboutMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "À PROPOS"),
      h(
        "p",
        null,
        h(
          "p",
          null,
          "Ce jeu est un projet que j'ai réalisé pour ma formation de Dev JS à l'Ifocop de Paris. Il a nécessité un bon mois de travail et pas mal de nuits blanches."
        ),
        h(
          "p",
          null,
          "Le code est entièrement écrit en JavaScript, HTML et CSS et n'utilise aucun framework (hormis une touche de Bootstrap pour l'éditeur de niveaux)."
        )
      ),
      h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.showLoadMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "CHARGER UN NIVEAU"),
      h(
        "ul",
        { class: "game-menu__list" },
        Object.keys(gameData.levels).map(
          function(key) {
            return h(
              "li",
              null,
              h(
                "a",
                {
                  href: "",
                  onclick: function(event) {
                    event.preventDefault
                      ? event.preventDefault()
                      : (event.returnValue = false);
                    this.game.currentLevelName = gameData.levels[key].name;
                    this.game.state = this.game.constructor.states.PAUSED;
                    this.game.start();
                  }.bind(this)
                },
                gameData.levels[key].name
              )
            );
          }.bind(this)
        )
      ),
      h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.close = function() {
  var gameMenuEl = document.querySelector(".game-menu");
  if (gameMenuEl) {
    emptyElement(gameMenuEl);
    this.uiContainerEl.removeChild(gameMenuEl);
  }
};

module.exports = GameMenu;


/***/ }),

/***/ "./js/game/ghost.js":
/*!**************************!*\
  !*** ./js/game/ghost.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

function Ghost() {}

Ghost.prototype.init = function(props) {
  this.clock = props.clock;
  this.player = props.player;
  this.reset();
};

Ghost.prototype.reset = function() {
  this.ghostIndex = 0;
  this.ghostPositions =
    Array.isArray(this.ghostPositionsTemp) &&
    this.ghostPositionsTemp.length !== 0
      ? this.ghostPositionsTemp.slice(0)
      : [];
  this.ghostPositionsTemp = [];
};

Ghost.prototype.update = function() {
  // var totalTime = this.clock.totalTime;
  // var ghostTimes = this.ghostPositions.map(function(position) {
  //   return position.time;
  // });
  // var currentGhostTime = ghostTimes.find(function(time, index) {
  //   return totalTime >= time && totalTime < ghostTimes[index + 1];
  // });
  // var ghostIndex = ghostTimes.indexOf(currentGhostTime);
  // var nextGhostTime = ghostTimes[ghostIndex + 1];

  // var timeRatio =
  //   (totalTime - currentGhostTime) / (nextGhostTime - currentGhostTime);

  // if (this.ghostPositions.length) {
  //   this.ghost = {};
  //   this.ghost.x =
  //     this.ghostPositions[ghostIndex].x +
  //     (this.ghostPositions[ghostIndex + 1].x -
  //       this.ghostPositions[ghostIndex].x) *
  //       timeRatio;
  //   this.ghost.y =
  //     this.ghostPositions[ghostIndex].y +
  //     (this.ghostPositions[ghostIndex + 1].y -
  //       this.ghostPositions[ghostIndex].y) *
  //       timeRatio;
  // } else {
  //   this.ghost = null;
  // }
  this.ghost = this.ghostPositions.length
    ? this.ghostPositions[this.ghostIndex]
    : null;
  this.ghostPositions[this.ghostIndex + 1] && this.ghostIndex++;

  // store position for next ghost
  this.ghostPositionsTemp.push({
    time: this.clock.totalTime,
    x: this.player.x,
    y: this.player.y
  });
};

Ghost.prototype.draw = function(ctx, camera) {
  if (this.ghost) {
    ctx.save();
    ctx.fillStyle = "rgba(180, 180, 180, 0.7)";
    ctx.fillRect(
      camera.applyToX(this.ghost.x),
      camera.applyToY(this.ghost.y),
      camera.applyToDistance(this.player.width),
      camera.applyToDistance(this.player.height)
    );
    if (!this.ghostPositions[this.ghostIndex + 1]) {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(this.ghost.x), camera.applyToY(this.ghost.y));
      ctx.lineTo(
        camera.applyToX(this.ghost.x + this.player.width),
        camera.applyToY(this.ghost.y + this.player.height)
      );
      ctx.moveTo(
        camera.applyToX(this.ghost.x + this.player.width),
        camera.applyToY(this.ghost.y)
      );
      ctx.lineTo(
        camera.applyToX(this.ghost.x),
        camera.applyToY(this.ghost.y + this.player.height)
      );
      ctx.stroke();
    }
    ctx.restore();
  }
};

module.exports = Ghost;


/***/ }),

/***/ "./js/game/laser.js":
/*!**************************!*\
  !*** ./js/game/laser.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Laser = (function() {
  function Laser(props) {
    this.length = 20;
    var A = new SDK.Vector(props.x, props.y);
    var B = SDK.Vector.sum(A, props.direction.scale(this.length));
    SDK.Segment.call(this, A, B);

    this.origin = new SDK.Vector(props.x, props.y);
    this.speed = 250;
    this.v = SDK.Vector.subtract(B, A)
      .getUnitVector()
      .scale(this.speed);

    // stats
    this.damage = props.damage;

    // timings
    this.createdAt = Date.now();
    this.range = props.range;

    this.color = props.color;
  }

  Laser.prototype = Object.create(SDK.Segment.prototype);
  Laser.prototype.constructor = Laser;

  Laser.prototype.hasReachedMaxRange = function() {
    return (
      SDK.Vector.subtract(this.B, this.origin).normSquared >=
      Math.pow(this.range, 2)
    );
  };

  Laser.prototype.update = function() {
    var dPos = this.v.scale(dt);
    this.A = SDK.Vector.sum(this.A, dPos);
    this.B = SDK.Vector.sum(this.B, dPos);
  };

  Laser.prototype.draw = function(ctx, camera) {
    var lineWidth = 3;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(this.A.x), camera.applyToY(this.A.y));
    ctx.lineTo(camera.applyToX(this.B.x), camera.applyToY(this.B.y));
    ctx.stroke();
    ctx.restore();
  };

  return Laser;
})();

module.exports = Laser;


/***/ }),

/***/ "./js/game/levelManager.js":
/*!*********************************!*\
  !*** ./js/game/levelManager.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Player = __webpack_require__(/*! ./player */ "./js/game/player.js");
var Player = __webpack_require__(/*! ./player */ "./js/game/player.js");
var Ennemy = __webpack_require__(/*! ./ennemy */ "./js/game/ennemy.js");
var Platform = __webpack_require__(/*! ./platform */ "./js/game/platform.js");
var MovingPlatform = __webpack_require__(/*! ./movingPlatform */ "./js/game/movingPlatform.js");
var skills = __webpack_require__(/*! ./skills */ "./js/game/skills.js");
var SkillHtml = skills.SkillHtml;
var SkillCss = skills.SkillCss;
var SkillSass = skills.SkillSass;
var SkillBootstrap = skills.SkillBootstrap;
var SkillReact = skills.SkillReact;
var SkillAngular = skills.SkillAngular;
var SkillJquery = skills.SkillJquery;
var SkillNode = skills.SkillNode;
var SkillMongo = skills.SkillMongo;
var SkillMeteor = skills.SkillMeteor;

var LevelManager = (function() {
  var level = {};

  var gameEntityConstructors = {
    Player: Player,
    Ennemy: Ennemy,
    Platform: Platform,
    MovingPlatform: MovingPlatform,
    SkillHtml: SkillHtml,
    SkillCss: SkillCss,
    SkillSass: SkillSass,
    SkillBootstrap: SkillBootstrap,
    SkillReact: SkillReact,
    SkillAngular: SkillAngular,
    SkillJquery: SkillJquery,
    SkillNode: SkillNode,
    SkillMongo: SkillMongo,
    SkillMeteor: SkillMeteor
  };

  function LevelManager(props) {
    this.data = props.data;
    this.app = props.app;
  }

  LevelManager.prototype.buildLevel = function(name) {
    if (!gameData.levels[name]) {
      return null;
    }
    var levelData = gameData.levels[name];
    var name = levelData.name;
    var worldRectData = levelData.worldRect;
    var playerData = levelData.player;
    var platformsData = levelData.platforms;
    var ennemiesData = levelData.ennemies;
    var skillsData = levelData.skills;

    level.name = name;
    level.countdownStart = levelData.countdownStart;
    level.worldRect = new SDK.Rectangle({
      x: worldRectData.props.x,
      y: worldRectData.props.y,
      width: worldRectData.props.width,
      height: worldRectData.props.height
    });
    level.player = new gameEntityConstructors[playerData.type](
      playerData.props
    );
    level.platforms = [];
    platformsData.forEach(function(platform) {
      level.platforms.push(
        new gameEntityConstructors[platform.type](platform.props)
      );
    });
    level.ennemies = [];
    ennemiesData.forEach(function(ennemy) {
      level.ennemies.push(
        new gameEntityConstructors[ennemy.type](ennemy.props.x, ennemy.props.y)
      );
    });
    level.skills = [];
    skillsData.forEach(function(skill) {
      level.skills.push(new gameEntityConstructors[skill.type](skill.props));
    });

    // temporary objects
    level.lasers = [];
    level.particles = [];

    return level;
  };

  /**
   * Put all level entities inside a single array.
   * @param {Array} extra
   */
  LevelManager.prototype.buildEntities = function(extra) {
    level.entities = []
      .concat(level.platforms)
      .concat(level.skills)
      .concat(level.ennemies)
      .concat(level.lasers)
      .concat([level.player]);

    if (extra) {
      level.entities = level.entities.concat(extra);
    }
  };

  LevelManager.prototype.deleteLevel = function(name) {
    delete gameData.levels[name];
  };

  return LevelManager;
})();

module.exports = LevelManager;


/***/ }),

/***/ "./js/game/lifebar.js":
/*!****************************!*\
  !*** ./js/game/lifebar.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var LifeBar = (function() {
  function LifeBar(props) {
    SDK.Rectangle.call(this, props);
    this.gameObject = props.gameObject;
  }

  LifeBar.prototype = Object.create(SDK.Rectangle.prototype);
  LifeBar.prototype.constructor = LifeBar;

  LifeBar.prototype.draw = function(ctx) {
    var hitPointsRation = this.gameObject.getHitPointsRatio();
    var lineWidth = 1;

    ctx.save();
    // life bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // life bar hit points
    ctx.fillStyle = "hsl(" + hitPointsRation * 120 + ", 100%, 40%)";
    ctx.fillRect(this.x, this.y, this.width * hitPointsRation, this.height);

    // life bar outline
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeRect(
      this.x - lineWidth / 2,
      this.y - lineWidth / 2,
      this.width + lineWidth,
      this.height + lineWidth
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fontWeight = "bold";
    ctx.fillText(
      Math.ceil(toFixedPrecision(hitPointsRation * 100)) + "%",
      this.x + this.width / 2,
      this.y + this.height + 20
    );
    ctx.restore();
  };

  return LifeBar;
})();

module.exports = LifeBar;


/***/ }),

/***/ "./js/game/movingPlatform.js":
/*!***********************************!*\
  !*** ./js/game/movingPlatform.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Platform = __webpack_require__(/*! ./platform */ "./js/game/platform.js");

var MovingPlatform = (function() {
  function MovingPlatform(props) {
    Platform.call(this, props);

    this.xStart = props.x !== undefined ? props.x : 0;
    this.yStart = props.x !== undefined ? props.y : 0;
    this.xEnd = props.xEnd !== undefined ? props.xEnd : this.xStart;
    this.yEnd = props.yEnd !== undefined ? props.yEnd : this.yStart;

    this.speed = props.speed || 50;
    this.v = new SDK.Vector(this.xEnd - this.x, this.yEnd - this.y);
    var vNorm = this.v.norm;
    this.v = this.v.scale(this.speed / vNorm);

    this.color = "rgb(0, 100, 255)";
    this.color = "darkorange";
  }

  MovingPlatform.prototype = Object.create(Platform.prototype);
  MovingPlatform.prototype.constructor = MovingPlatform;

  MovingPlatform.prototype.updateVelocity = function() {
    // // horizontal velocity
    // if (
    //   this.v.x > 0 &&
    //   ((this.xEnd - this.xStart) * (this.xEnd - this.x) < 0 ||
    //     (this.xEnd - this.xStart) * (this.x - this.xStart) < 0)
    // ) {
    //   this.v.x = -Math.abs(this.v.x);
    // } else if (
    //   this.v.x < 0 &&
    //   ((this.xEnd - this.xStart) * (this.xEnd - this.x) < 0 ||
    //     (this.xEnd - this.xStart) * (this.x - this.xStart) < 0)
    // ) {
    //   this.v.x = Math.abs(this.v.x);
    // }
    // // vertical velocity
    // if (
    //   this.v.y > 0 &&
    //   ((this.yEnd - this.yStart) * (this.yEnd - this.y) < 0 ||
    //     (this.yEnd - this.yStart) * (this.y - this.yStart) < 0)
    // ) {
    //   this.v.y = -Math.abs(this.v.y);
    // } else if (
    //   this.v.y < 0 &&
    //   ((this.yEnd - this.yStart) * (this.yEnd - this.y) < 0 ||
    //     (this.yEnd - this.yStart) * (this.y - this.yStart) < 0)
    // ) {
    //   this.v.y = Math.abs(this.v.y);
    // }
  };

  MovingPlatform.prototype.update = function() {
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;
    if (this.x + dx > this.xEnd || this.y + dy > this.yEnd) {
      this.v.x = -Math.abs(this.v.x);
      this.v.y = -Math.abs(this.v.y);
    }
    if (this.x + dx < this.xStart || this.y + dy < this.yStart) {
      this.v.x = Math.abs(this.v.x);
      this.v.y = Math.abs(this.v.y);
    }

    this.x = toFixedPrecision(this.x + dx, 2);
    this.y = toFixedPrecision(this.y + dy, 2);
  };

  return MovingPlatform;
})();

module.exports = MovingPlatform;


/***/ }),

/***/ "./js/game/particleEmitters.js":
/*!*************************************!*\
  !*** ./js/game/particleEmitters.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SmokeParticle = __webpack_require__(/*! ./smokeParticle */ "./js/game/smokeParticle.js");

var sparksParticles = function(gameObj) {
  var start = Date.now();

  return {
    particleIndex: 0,
    particles: {},
    minSpeed: 5,
    maxSpeed: 20,
    size: 10,
    maxLife: 2000,
    duration: 200,
    addNewParticle: function() {
      this.particleIndex++;
      var color = !gameObj.hasWon
        ? gameObj.color
        : "rgb(" +
          randInt(0, 255) +
          ", " +
          randInt(0, 255) +
          ", " +
          randInt(0, 255) +
          ")";
      switch (randInt(0, 3)) {
        case 0:
          // top edge
          particle = new SmokeParticle({
            x: randInt(gameObj.left, gameObj.right),
            y: gameObj.top - this.size,
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, this.maxSpeed),
            vy: randInt(-this.maxSpeed, -this.minSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 1:
          // bottom edge
          particle = new SmokeParticle({
            x: randInt(gameObj.left, gameObj.right),
            y: gameObj.bottom,
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, this.maxSpeed),
            vy: randInt(this.minSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 2:
          // left edge
          particle = new SmokeParticle({
            x: gameObj.left - this.size,
            y: randInt(gameObj.top, gameObj.bottom),
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, -this.minSpeed),
            vy: randInt(-this.maxSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 3:
          // right edge
          particle = new SmokeParticle({
            x: gameObj.right,
            y: randInt(gameObj.top, gameObj.bottom),
            size: this.size,
            color: color,
            vx: randInt(this.minSpeed, this.maxSpeed),
            vy: randInt(-this.maxSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
      }
    },
    update: function() {
      // only add particles for a certain duration
      if (Date.now() <= start + this.duration) {
        for (var i = 0; i < 2; i++) {
          this.addNewParticle();
        }
      }

      for (var id in this.particles) {
        var particle = this.particles[id];
        particle.update();
        if (Date.now() - particle.createdAt >= this.maxLife) {
          delete this.particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in this.particles) {
        var particle = this.particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};

var explosionParticles = function(gameObj) {
  var size = 5;
  var minLife = 500;
  var maxLife = 1500;
  var particles = [];
  var minSpeed = 10;
  var maxSpeed = 50;
  var particleIndex = 0;
  for (var i = gameObj.left; i < gameObj.right; i += size) {
    for (var j = gameObj.top; j < gameObj.bottom; j += size) {
      var center = gameObj.center;
      var v = new SDK.Vector(
        randInt(-maxSpeed * 5, maxSpeed * 5),
        randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new SDK.Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: randInt(minLife, maxLife)
      });
      particles[particleIndex] = particle;
      particleIndex++;
      var v = new SDK.Vector(
        randInt(-maxSpeed * 5, maxSpeed * 5),
        randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new SDK.Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: randInt(minLife, maxLife)
      });
      particles[particleIndex] = particle;
      particleIndex++;
    }
  }
  return {
    update: function() {
      for (var id in particles) {
        var particle = particles[id];
        particle.v.y += (gameObj.GRAVITY_ACCELERATION / 4) * dt;
        particle.update();
        if (Date.now() - particle.createdAt >= particle.maxLife) {
          delete particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in particles) {
        var particle = particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};

var hitParticles = function(x, y, direction, color) {
  var createdAt = Date.now();
  var particleIndex = 0;
  var maxCount = 10;
  var size = 4;
  var minLife = 300;
  var maxLife = 500;
  var minSpeed = 10;
  var maxSpeed = 200;
  var particles = {};
  for (var i = 0; i < maxCount; i++) {
    var v = direction
      .getUnitVector()
      .scale(randInt(minSpeed, maxSpeed))
      .rotateRadians((Math.random() * Math.PI) / 3 - Math.PI / 6);
    var particle = new SDK.Particle({
      x: x,
      y: y,
      size: size,
      color: color,
      vx: v.x,
      vy: v.y,
      maxLife: randInt(minLife, maxLife)
    });
    particleIndex++;
    particles[particleIndex] = particle;
  }
  return {
    createdAt: createdAt,
    particleIndex: particleIndex,
    maxCount: maxCount,
    size: size,
    minLife: minLife,
    maxLife: maxLife,
    minSpeed: minSpeed,
    maxSpeed: maxSpeed,
    particles: particles,
    update: function() {
      for (var id in particles) {
        var particle = particles[id];
        particle.update();
        if (Date.now() - particle.createdAt >= particle.maxLife) {
          delete particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in particles) {
        var particle = particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};

module.exports = {
  sparksParticles: sparksParticles,
  explosionParticles: explosionParticles,
  hitParticles: hitParticles
};


/***/ }),

/***/ "./js/game/platform.js":
/*!*****************************!*\
  !*** ./js/game/platform.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Platform = (function() {
  var MAX_SPEED = 100;

  function Platform(props) {
    SDK.Rectangle.call(this, props);

    this.v = new SDK.Vector();
    this.solid = props && props.solid !== undefined ? props.solid : true; // can collide with other solid objects
    this.passthrough =
      props && props.passthrough !== undefined ? props.passthrough : false; // can it be traversed upwards
    this.touched = false; // is the player touching the platform
    this.color = "#5e4c4c";
  }

  Platform.prototype = Object.create(SDK.Rectangle.prototype);
  Platform.prototype.constructor = Platform;

  Platform.prototype.update = function() {};

  Platform.prototype.draw = function(ctx, camera) {
    var lineWidth = 3;
    ctx.save();
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    if (this.touched || !this.passthrough) {
      ctx.strokeStyle = "#db0000";
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(
        camera.applyToX(this.x + lineWidth / 2),
        camera.applyToY(this.y + lineWidth / 2),
        camera.applyToDistance(this.width - lineWidth),
        camera.applyToDistance(this.height - lineWidth)
      );
      ctx.fill();
      ctx.stroke();
    } else {
      lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = camera.applyToDistance(lineWidth);
      ctx.beginPath();
      ctx.strokeRect(
        camera.applyToX(this.x + lineWidth / 2),
        camera.applyToY(this.y + lineWidth / 2),
        camera.applyToDistance(this.width - lineWidth),
        camera.applyToDistance(this.height - lineWidth)
      );
    }
    ctx.restore();
  };

  return Platform;
})();

module.exports = Platform;


/***/ }),

/***/ "./js/game/player.js":
/*!***************************!*\
  !*** ./js/game/player.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Shield = __webpack_require__(/*! ./shield */ "./js/game/shield.js");
var particleEmitters = __webpack_require__(/*! ./particleEmitters */ "./js/game/particleEmitters.js");

var ABS_JUMP_SPEED = 700;
var MAX_FALL_SPEED = 1000;
var INITIAL_WIDTH = 30;
var INITIAL_HEIGHT = 30;
var CROUCH_STAND_ANIMATION_DURATION = 0.2;

function Player(props) {
  SDK.Rectangle.call(this, {
    x: props.x,
    y: props.y,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT
  });

  this.v = new SDK.Vector();
  this.acceleration = new SDK.Vector();
  this.COEFFICIENT_OF_RESTITUTION = 0.4;
  this.solid = true; // can collide with other solid objects
  this.maxHitPoints = 100;
  this.hitPoints = this.maxHitPoints;
  this.skills = []; // the player must harvest these
  this.color = this.getColorFromHP();

  // crouching / standing state and animations
  this.isCrouching = false;
  CROUCH_STAND_ANIMATION_DURATION = 0.2;

  // collision direction for movement
  this.isColliding = [0, 0]; // [horizontal, vertical]
  this.collidableWith = []; // potential object collisions
  this.collidingWith = [null, null]; // actual object collisions
  this.shield = new Shield({ shielded: this });

  // sounds
  this.sounds = {
    jump: [
      // new SDK.Sound("./assets/sounds/Swoosh1.mp3", 0.25),
      new SDK.Sound("./assets/sounds/Swoosh2.mp3", 0.1),
      new SDK.Sound("./assets/sounds/Swoosh3.mp3", 0.3)
    ],
    hit: [
      new SDK.Sound("./assets/sounds/Hit 1.mp4", 0.2),
      new SDK.Sound("./assets/sounds/Hit 2.mp4", 0.2)
    ],
    still: new SDK.Sound("./assets/sounds/Medium hum.mp4", 0.15),
    die: new SDK.Sound("./assets/sounds/impactsplat03.mp3", 0.8),
    hurt: new SDK.Sound("./assets/sounds/Knife Stab.mp3", 0.2)
  };

  // should the player get stuck to the ceiling when jumping?
  this.stickyJump = false;

  // player's own gravity
  this.GRAVITY_ACCELERATION = gameData.constants.GRAVITY_ACCELERATION;
}

Player.prototype = Object.create(SDK.Rectangle.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveLeft = function() {
  this.v.x = -250;
};

Player.prototype.moveRight = function() {
  this.v.x = 250;
};

Player.prototype.crouch = function() {
  this.isCrouching = true;
};

Player.prototype.stand = function() {
  this.isCrouching = false;
};

Player.prototype.jump = function() {
  if (this.isColliding[1] === Math.sign(this.GRAVITY_ACCELERATION)) {
    // emit particles
    this.sparks = particleEmitters.sparksParticles(this);

    this.sounds.jump[randInt(0, this.sounds.jump.length - 1)].replay();
    this.isColliding[1] = 0;
    this.v.y = -Math.sign(this.GRAVITY_ACCELERATION) * ABS_JUMP_SPEED;
  }
};

Player.prototype.reverseGravity = function() {
  this.GRAVITY_ACCELERATION = -this.GRAVITY_ACCELERATION;
};

Player.prototype.zeroGravity = function() {
  if (this.GRAVITY_ACCELERATION) {
    this.GRAVITY_ACCELERATION = 0;
  } else {
    this.GRAVITY_ACCELERATION = gameData.constants.GRAVITY_ACCELERATION;
  }
};

Player.prototype.applyDamage = function(damage) {
  this.sounds.hurt.replay();
  this.hitPoints = toFixedPrecision(this.hitPoints - damage);
};

Player.prototype.die = function(cb) {
  this.isDead = true;
  this.hitPoints = 0;
  this.color = this.getColorFromHP();
  this.sounds.still.stop();
  this.sounds.die.play();
  this.explosion = particleEmitters.explosionParticles(this);
  cb && cb();
};

Player.prototype.getDeltaWidth = function() {
  var deltaWidth;
  var computedDelta =
    (dt / CROUCH_STAND_ANIMATION_DURATION) * (INITIAL_HEIGHT - INITIAL_WIDTH); // absolute value
  if (this.isCrouching) {
    deltaWidth =
      this.height - computedDelta < INITIAL_WIDTH
        ? this.height - INITIAL_WIDTH
        : computedDelta;
  } else {
    deltaWidth =
      this.height + computedDelta > INITIAL_HEIGHT
        ? this.height - INITIAL_HEIGHT
        : -computedDelta;
  }
  return deltaWidth;
};

Player.prototype.updatePlayerSize = function(deltaWidth) {
  this.width = toFixedPrecision(this.width + deltaWidth, 3);
  this.height = toFixedPrecision(this.height - deltaWidth, 3);
  this.x = toFixedPrecision(this.x - deltaWidth / 2, 3);
  this.y =
    this.GRAVITY_ACCELERATION < 0
      ? toFixedPrecision(this.y, 3)
      : toFixedPrecision(this.y + deltaWidth, 3);
};

Player.prototype.applyGravity = function() {
  // apply gravity if player is free falling
  this.acceleration.y = this.GRAVITY_ACCELERATION;

  // compute new speed based on acceleration and time ellapsed
  this.v.y += this.acceleration.y * dt;
  this.v.y =
    Math.abs(this.v.y) > MAX_FALL_SPEED
      ? Math.sign(this.v.y) * MAX_FALL_SPEED
      : this.v.y;
};

Player.prototype.update = function() {
  if (this.isDead) {
    this.explosion.update();
    return;
  } else {
    this.sparks && this.sparks.update();
  }

  var dx = this.v.x * dt,
    dy = this.v.y * dt;

  this.updatePlayerSize(this.getDeltaWidth());

  // apply natural position increments if no collision detected
  if (!this.isColliding[1]) {
    this.y = toFixedPrecision(this.y + dy, 4);
  }
  if (!this.isColliding[0]) {
    this.x = toFixedPrecision(this.x + dx, 4);
  }
};

Player.prototype.getHitPointsRatio = function() {
  return this.hitPoints / this.maxHitPoints;
};

Player.prototype.getColorFromHP = function() {
  var hitPointsRatio = this.getHitPointsRatio();
  var color = "hsl(" + hitPointsRatio * 120 + ", 100%, 50%)";
  return color;
};

Player.prototype.draw = function(ctx, camera) {
  // draw particles
  this.color = this.getColorFromHP();
  this.isDead && this.explosion.draw(ctx, camera);
  !this.isDead && this.sparks && this.sparks.draw(ctx, camera);

  // draw player
  if (!this.isDead) {
    var center = this.center;
    var lineWidth = 5;

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    ctx.fillRect(
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.width),
      camera.applyToDistance(this.height)
    );

    // draw mask
    ctx.fillStyle = "black";
    ctx.fillRect(
      camera.applyToX(this.left),
      camera.applyToY(this.top + 10),
      camera.applyToDistance(this.width),
      camera.applyToDistance(10)
    );

    // draw eyes
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(center.x - 10), camera.applyToY(this.top + 12));
    ctx.quadraticCurveTo(
      camera.applyToX(center.x - 4),
      camera.applyToY(this.top + 14),
      camera.applyToX(center.x - 4),
      camera.applyToY(this.top + 16)
    );
    ctx.quadraticCurveTo(
      camera.applyToX(center.x - 10),
      camera.applyToY(this.top + 16),
      camera.applyToX(center.x - 10),
      camera.applyToY(this.top + 14)
    );
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(center.x + 10), camera.applyToY(this.top + 12));
    ctx.quadraticCurveTo(
      camera.applyToX(center.x + 4),
      camera.applyToY(this.top + 14),
      camera.applyToX(center.x + 4),
      camera.applyToY(this.top + 16)
    );
    ctx.quadraticCurveTo(
      camera.applyToX(center.x + 10),
      camera.applyToY(this.top + 16),
      camera.applyToX(center.x + 10),
      camera.applyToY(this.top + 14)
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // draw shield
    if (this.shield.isOpen || this.shield.isAnimating) {
      this.shield.draw(ctx, camera);
    }
  }
};

module.exports = Player;


/***/ }),

/***/ "./js/game/shield.js":
/*!***************************!*\
  !*** ./js/game/shield.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Shield = (function() {
  var MIN_SIZE = 0;
  var MAX_SIZE = 40;

  function Shield(props) {
    this.shielded = props.shielded || null; // object benefitting from the shield
    this.r = MIN_SIZE;
    this.isOpen = false;
    this.isAnimating = false;

    // timings
    this.openingDuration = 0.3;
    this.closingDuration = 0.6;

    // hit points
    this.hitPoints = 200;

    // sounds
    this.sounds = {
      open: new SDK.Sound("./assets/sounds/Open.mp3", 0.1),
      close: new SDK.Sound("./assets/sounds/Close.mp3", 0.2)
    };
  }

  Shield.prototype.getBoundingRect = function() {
    var shielded = this.shielded;
    return new SDK.Rectangle({
      x: shielded.left - this.r,
      y: shielded.top - this.r,
      width: shielded.width + this.r * 2,
      height: shielded.height + this.r * 2
    });
  };

  Shield.prototype.open = function() {
    this.sounds.close.stop();
    this.sounds.open.play();
    this.isOpen = true;
    this.isAnimating = true;
  };

  Shield.prototype.close = function() {
    this.sounds.open.stop();
    this.sounds.close.play();
    this.isOpen = false;
    this.isAnimating = true;
  };

  Shield.prototype.update = function() {
    var dr;
    if (this.isOpen) {
      dr = ((MAX_SIZE - MIN_SIZE) / this.openingDuration) * dt;
      // shield opening
      if (this.r + dr < MAX_SIZE) {
        this.r += dr;
      } else {
        this.r = MAX_SIZE;
        this.isAnimating = false;
      }
    } else {
      dr = ((MAX_SIZE - MIN_SIZE) / this.closingDuration) * dt;
      // shield closing
      if (this.r - dr > MIN_SIZE) {
        this.r -= dr;
      } else {
        this.r = MIN_SIZE;
        this.isAnimating = false;
      }
    }
  };

  Shield.prototype.hasCollisionWithLaser = function(laser) {
    var boundingRect = this.getBoundingRect();
    var collision = physics.collision;
    var shielded = this.shielded;
    var r = this.r;

    // return if the two shapes bounding rectangles don't collide
    if (!collision.AABBWithAABB(boundingRect, laser.getBoundingRect())) {
      return false;
    }

    // the shield can be decomposed in 6 shapes
    c1 = new SDK.Circle({ x: shielded.left, y: shielded.top, r: r });
    c2 = new SDK.Circle({ x: shielded.right, y: shielded.top, r: r });
    c3 = new SDK.Circle({ x: shielded.right, y: shielded.bottom, r: r });
    c4 = new SDK.Circle({ x: shielded.left, y: shielded.bottom, r: r });
    r1 = new SDK.Rectangle({
      x: shielded.left - r,
      y: shielded.top,
      width: shielded.width + 2 * r,
      height: shielded.height
    });
    r2 = new SDK.Rectangle({
      x: shielded.left,
      y: shielded.top - r,
      width: shielded.width,
      height: shielded.height + 2 * r
    });

    return (
      c1.containsPoint(laser.A) ||
      c1.containsPoint(laser.B) ||
      c2.containsPoint(laser.A) ||
      c2.containsPoint(laser.B) ||
      c3.containsPoint(laser.A) ||
      c3.containsPoint(laser.B) ||
      c4.containsPoint(laser.A) ||
      c4.containsPoint(laser.B) ||
      r1.contains(laser.A.x, laser.A.y) ||
      r1.contains(laser.B.x, laser.B.y) ||
      r2.contains(laser.A.x, laser.A.y) ||
      r2.contains(laser.B.x, laser.B.y)
    );
  };

  Shield.prototype.draw = function(ctx, camera) {
    var left = this.shielded.x - this.r;
    var top = this.shielded.y - this.r;
    var right = left + 2 * this.r + this.shielded.width;
    var bottom = top + 2 * this.r + this.shielded.height;
    var lineWidth = 2;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.strokeStyle = this.shielded.color;
    ctx.lineWidth = camera.applyToDistance(lineWidth);
    ctx.beginPath();
    ctx.moveTo(camera.applyToX(left), camera.applyToY(top + this.r));
    ctx.arcTo(
      camera.applyToX(left),
      camera.applyToY(top),
      camera.applyToX(left + this.r),
      camera.applyToY(top),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(right - this.r), camera.applyToY(top));
    ctx.arcTo(
      camera.applyToX(right),
      camera.applyToY(top),
      camera.applyToX(right),
      camera.applyToY(top + this.r),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(right), camera.applyToY(bottom - this.r));
    ctx.arcTo(
      camera.applyToX(right),
      camera.applyToY(bottom),
      camera.applyToX(right - this.r),
      camera.applyToY(bottom),
      camera.applyToDistance(this.r)
    );
    ctx.lineTo(camera.applyToX(left + this.r), camera.applyToY(bottom));
    ctx.arcTo(
      camera.applyToX(left),
      camera.applyToY(bottom),
      camera.applyToX(left),
      camera.applyToY(bottom - this.r),
      camera.applyToDistance(this.r)
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  return Shield;
})();

module.exports = Shield;


/***/ }),

/***/ "./js/game/skill.js":
/*!**************************!*\
  !*** ./js/game/skill.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Skill = (function() {
  function Skill(props) {
    SDK.Rectangle.call(this, props);

    this.v = new SDK.Vector();
    this.solid = false;
    this.image = new Image();
    this.image.src = props.src;
  }

  Skill.prototype = Object.create(SDK.Rectangle.prototype);
  Skill.prototype.constructor = Skill;

  Skill.prototype.update = function() {};

  Skill.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.drawImage(
      this.image,
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.width),
      camera.applyToDistance(this.height)
    );
    ctx.restore();
  };

  return Skill;
})();

module.exports = Skill;


/***/ }),

/***/ "./js/game/skillBar.js":
/*!*****************************!*\
  !*** ./js/game/skillBar.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function SkillBar(props) {
  this.player = props.player;
  this.skills = props.skills;
}

SkillBar.prototype.draw = function(ctx) {
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
  this.player.skills.forEach(function(skill, index) {
    ctx.drawImage(
      skill.image,
      70 + (index % 2) * 45,
      200 + ((index - (index % 2)) / 2) * 45,
      30,
      30
    );
  }, this);
  ctx.restore();
};

module.exports = SkillBar;


/***/ }),

/***/ "./js/game/skills.js":
/*!***************************!*\
  !*** ./js/game/skills.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Skill = __webpack_require__(/*! ./skill */ "./js/game/skill.js");

function SkillHtml(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/html-5-icon.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillHtml.prototype = Object.create(Skill.prototype);
SkillHtml.prototype.constructor = SkillHtml;

function SkillCss(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/css-3-icon.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillCss.prototype = Object.create(Skill.prototype);
SkillCss.prototype.constructor = SkillCss;

function SkillSass(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/sass-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillSass.prototype = Object.create(Skill.prototype);
SkillSass.prototype.constructor = SkillSass;

function SkillBootstrap(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/bootstrap-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillBootstrap.prototype = Object.create(Skill.prototype);
SkillBootstrap.prototype.constructor = SkillBootstrap;

function SkillJquery(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/jquery-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillJquery.prototype = Object.create(Skill.prototype);
SkillJquery.prototype.constructor = SkillJquery;

function SkillReact(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/react-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillReact.prototype = Object.create(Skill.prototype);
SkillReact.prototype.constructor = SkillReact;

function SkillAngular(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/angular-logo.svg",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillAngular.prototype = Object.create(Skill.prototype);
SkillAngular.prototype.constructor = SkillAngular;

function SkillNode(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/nodejs-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillNode.prototype = Object.create(Skill.prototype);
SkillNode.prototype.constructor = SkillNode;

function SkillMeteor(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/meteor-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillMeteor.prototype = Object.create(Skill.prototype);
SkillMeteor.prototype.constructor = SkillMeteor;

function SkillMongo(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/mongodb-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillMongo.prototype = Object.create(Skill.prototype);
SkillMongo.prototype.constructor = SkillMongo;

module.exports = {
  SkillAngular: SkillAngular,
  SkillBootstrap: SkillBootstrap,
  SkillCss: SkillCss,
  SkillHtml: SkillHtml,
  SkillJquery: SkillJquery,
  SkillMeteor: SkillMeteor,
  SkillMongo: SkillMongo,
  SkillNode: SkillNode,
  SkillReact: SkillReact,
  SkillSass: SkillSass
};


/***/ }),

/***/ "./js/game/smokeParticle.js":
/*!**********************************!*\
  !*** ./js/game/smokeParticle.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var SmokeParticle = (function() {
  function SmokeParticle(props) {
    SDK.Particle.call(this, props);

    this.image = new Image();
    this.image.src = "./assets/images/smoke2.png";
  }

  SmokeParticle.prototype = Object.create(SDK.Particle.prototype);
  SmokeParticle.prototype.constructor = SmokeParticle;

  SmokeParticle.prototype.draw = function(ctx, camera) {
    ctx.globalAlpha = Math.max(
      0,
      1 - (Date.now() - this.createdAt) / this.maxLife
    );
    ctx.save();
    ctx.drawImage(
      this.image,
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.size),
      camera.applyToDistance(this.size)
    );
    ctx.restore();
  };
  return SmokeParticle;
})();

module.exports = SmokeParticle;


/***/ }),

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Game = __webpack_require__(/*! ./game/game */ "./js/game/game.js");

window.addEventListener("DOMContentLoaded", function() {
  // go fullscreen
  document.documentElement.requestFullscreen =
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullScreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen;

  var gameContainer = document.getElementById("game-container");
  var canvases = document.getElementsByTagName("canvas");
  var startGameButton = document.getElementById("start-game");
  var gameIntroEl = document.getElementById("game-intro");

  function resize() {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      var canvasWidth = parseFloat(getComputedStyle(canvas).width);
      var canvasHeight = parseFloat(getComputedStyle(canvas).height);
      // change resolution
      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", canvasHeight);
    }
  }

  startGameButton.addEventListener("click", function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    // go fullscreen
    document.documentElement.requestFullscreen &&
      document.documentElement.requestFullscreen();

    // instantiate game
    show(gameContainer);
    hide(gameIntroEl);
    window.game = new Game({
      shouldDisplayDebug: true,
      shouldDisplayRulers: true
    });

    game.start();
  });
  window.addEventListener("blur", function(e) {
    if (window.hasOwnProperty("game")) {
      game.pause();
    }
  });
  window.addEventListener("resize", resize);
  resize();

  // update debug info
  var debugEl = document.querySelector(".debug");
  if (window.hasOwnProperty("game")) {
    setInterval(function() {
      game.updateDebugInfo();
    }, 50);
  }
});


/***/ })

/******/ });
//# sourceMappingURL=game.js.map