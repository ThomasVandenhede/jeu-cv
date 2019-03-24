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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/levelEditor.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./js/game/gameData.json":
/*!*******************************!*\
  !*** ./js/game/gameData.json ***!
  \*******************************/
/*! exports provided: constants, colors, sounds, musics, levels, default */
/***/ (function(module) {

module.exports = {"constants":{"GRAVITY_ACCELERATION":1600},"colors":{"STAR_WARS_YELLOW":"#ffd700"},"sounds":{"location":"./assets/sounds/","files":[{"filename":"Hit 1.mp4","volume":0.2},{"filename":"Hit 2.mp4","volume":0.2},{"filename":"Light swing 1.mp4","volume":1},{"filename":"Light swing 1.mp4","volume":1},{"filename":"Medium hum.mp4","volume":0.15},{"filename":"Open.mp3","volume":0.4},{"filename":"Close.mp3","volume":0.6},{"filename":"impactsplat03.mp3.flac","volume":0.8}]},"musics":{"location":"./assets/music/","files":[{"filename":"Star Wars - John Williams - Duel Of The Fates.mp3","volume":1}]},"levels":{"test level":{"name":"test level","countdownStart":5000,"cssBackground":{"src":"./assets/images/background_1000_stars.png","size":"800px 600px"},"worldRect":{"props":{"x":-1000,"y":-2000,"width":5000,"height":8000}},"player":{"type":"Player","props":{"x":10,"y":-200,"color":"red"}},"platforms":[{"type":"Platform","props":{"x":0,"y":-350,"width":200,"height":5}},{"type":"Platform","props":{"x":350,"y":-250,"width":50,"height":5}},{"type":"Platform","props":{"x":0,"y":-130,"width":180,"height":5}},{"type":"Platform","props":{"x":0,"y":-150,"width":180,"height":5}},{"type":"Platform","props":{"x":330,"y":-400,"width":150,"height":5}},{"type":"Platform","props":{"x":150,"y":200,"width":50,"height":5}},{"type":"Platform","props":{"x":500,"y":-270,"width":80,"height":80}},{"type":"Platform","props":{"x":600,"y":-500,"width":400,"height":20}}],"ennemies":[],"skills":[{"type":"SkillHtml","props":{"x":350,"y":-570,"width":50,"height":50}},{"type":"SkillCss","props":{"x":500,"y":-600,"width":50,"height":50}},{"type":"SkillJquery","props":{"x":1000,"y":-600,"width":50,"height":50}},{"type":"SkillMongo","props":{"x":200,"y":0,"width":50,"height":50}}]},"level 1":{"name":"level 1","countdownStart":15000,"cssBackground":{"src":"./assets/images/background_1000_stars.png","size":"800px 600px"},"worldRect":{"props":{"x":0,"y":-2000,"width":3000,"height":3000}},"player":{"type":"Player","props":{"x":10,"y":-500}},"platforms":[{"type":"Platform","props":{"x":-20,"y":-400,"width":220,"height":10}},{"type":"Platform","props":{"x":350,"y":-250,"width":50,"height":10}},{"type":"Platform","props":{"x":0,"y":-130,"width":180,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-150,"width":180,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":330,"y":-390,"width":150,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":150,"y":200,"width":50,"height":10}},{"type":"Platform","props":{"x":500,"y":-270,"width":80,"height":80}},{"type":"Platform","props":{"x":480,"y":-170,"width":120,"height":160}},{"type":"Platform","props":{"x":500,"y":10,"width":80,"height":120,"passthrough":true}},{"type":"Platform","props":{"x":480,"y":180,"width":120,"height":120,"passtarough":true}},{"type":"Platform","props":{"x":700,"y":-80,"width":30,"height":20}},{"type":"Platform","props":{"x":350,"y":70,"width":30,"height":20,"passthrough":true}},{"type":"Platform","props":{"x":700,"y":210,"width":30,"height":20,"passthrough":true}},{"type":"Platform","props":{"x":200,"y":-470,"width":10,"height":170}},{"type":"Platform","props":{"x":0,"y":-10000,"width":0,"height":20000}},{"type":"Platform","props":{"x":0,"y":-500,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-600,"width":100,"height":100}},{"type":"Platform","props":{"x":400,"y":-600,"width":100,"height":100}},{"type":"Platform","props":{"x":100,"y":-600,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-700,"width":200,"height":100}},{"type":"Platform","props":{"x":500,"y":-700,"width":100,"height":100}},{"type":"Platform","props":{"x":200,"y":-700,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-800,"width":100,"height":100}},{"type":"Platform","props":{"x":400,"y":-800,"width":100,"height":100}},{"type":"Platform","props":{"x":100,"y":-800,"width":400,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":0,"y":-900,"width":300,"height":10,"passthrough":true}},{"type":"Platform","props":{"x":300,"y":-900,"width":100,"height":100}},{"type":"MovingPlatform","props":{"x":200,"y":-430,"width":100,"height":10,"xEnd":400,"yEnd":-430,"speed":100}},{"type":"MovingPlatform","props":{"x":700,"y":-400,"width":80,"height":30,"xEnd":700,"yEnd":-100,"speed":100,"passthrough":true}},{"type":"MovingPlatform","props":{"x":0,"y":-200,"width":200,"height":50,"xEnd":30,"yEnd":400,"speed":100}},{"type":"Platform","props":{"x":800,"y":-500,"width":500,"height":10}},{"type":"MovingPlatform","props":{"x":950,"y":-800,"width":50,"height":200,"xEnd":950,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":1050,"y":-800,"width":50,"height":200,"xEnd":1050,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":1150,"y":-800,"width":50,"height":200,"xEnd":1150,"yEnd":-700,"speed":200}},{"type":"MovingPlatform","props":{"x":100,"y":-600,"width":100,"height":100,"xEnd":300,"yEnd":-600,"speed":100}},{"type":"MovingPlatform","props":{"x":850,"y":-400,"width":150,"height":10,"xEnd":1250,"yEnd":-400,"speed":200}}],"ennemies":[{"type":"Ennemy","props":{"x":450,"y":-650}},{"type":"Ennemy","props":{"x":120,"y":-750}},{"type":"Ennemy","props":{"x":900,"y":-700}},{"type":"Ennemy","props":{"x":1250,"y":-700}},{"type":"Ennemy","props":{"x":320,"y":-970}},{"type":"Ennemy","props":{"x":900,"y":-300}},{"type":"Ennemy","props":{"x":850,"y":-300}},{"type":"Ennemy","props":{"x":950,"y":-300}},{"type":"Ennemy","props":{"x":300,"y":-250}},{"type":"Ennemy","props":{"x":300,"y":250}},{"type":"Ennemy","props":{"x":20,"y":-100}},{"type":"Ennemy","props":{"x":650,"y":-500}}],"skills":[{"type":"SkillHtml","props":{"x":350,"y":-570,"width":50,"height":50}},{"type":"SkillCss","props":{"x":500,"y":-600,"width":50,"height":50}},{"type":"SkillJquery","props":{"x":1000,"y":-600,"width":50,"height":50}},{"type":"SkillMongo","props":{"x":200,"y":0,"width":50,"height":50}},{"type":"SkillReact","props":{"x":500,"y":-200,"width":50,"height":50}},{"type":"SkillAngular","props":{"x":1300,"y":-600,"width":50,"height":50}},{"type":"SkillMeteor","props":{"x":10,"y":-880,"width":50,"height":50}},{"type":"SkillSass","props":{"x":830,"y":50,"width":50,"height":50}},{"type":"SkillBootstrap","props":{"x":20,"y":-350,"width":50,"height":50}},{"type":"SkillNode","props":{"x":1000,"y":-450,"width":50,"height":50}}]}}};

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

/***/ "./js/levelEditor.js":
/*!***************************!*\
  !*** ./js/levelEditor.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var LevelEditor = __webpack_require__(/*! ./levelEditor/gameLevelEditor */ "./js/levelEditor/gameLevelEditor.js");

window.addEventListener("DOMContentLoaded", function() {
  function fitCanvasToContainer() {
    var canvases = document.getElementsByTagName("canvas");
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.setAttribute(
        "width",
        parseFloat(window.getComputedStyle(canvas).width)
      );
      canvas.setAttribute(
        "height",
        parseFloat(window.getComputedStyle(canvas).height)
      );
    }
  }
  window.addEventListener("resize", fitCanvasToContainer);
  fitCanvasToContainer();

  // start level editor
  window.levelEditor = new LevelEditor();
  levelEditor.init({
    rulers: true
  });
  levelEditor.start();
});


/***/ }),

/***/ "./js/levelEditor/creationTool.js":
/*!****************************************!*\
  !*** ./js/levelEditor/creationTool.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var CreationTool = (function() {
  var defaultOptions = {
    Player: {},
    Ennemy: {},
    Skill: {},
    Platform: {
      passthrough: false
    },
    MovingPlatform: {
      passthrough: false,
      positionRatio: 0
    }
  };

  function CreationTool(props) {
    this.gameObjects = props.gameObjects;
    this.camera = props.camera;
    this.mouse = props.mouse;
    this.grid = props.grid;
    this.canvas = props.canvas;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.eventHandlers = {
      mouse: {
        mousedown: {
          handler: this.handleMouseDown,
          props: undefined
        },
        mouseup: {
          handler: this.handleMouseUp,
          props: undefined
        },
        mousemove: {
          handler: this.handleMouseMove,
          props: undefined
        }
      }
    };
  }

  CreationTool.prototype.handleMouseDown = function handleMouseDown(e) {
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );

    switch (e.button) {
      case 0:
        // left mouse button
        var Constructor = this.gameObjectConstructor;
        var gameObject = new Constructor({
          x: mouseGamePosSnappedToGrid.x,
          y: mouseGamePosSnappedToGrid.y
        });
        this.gameObjects.push(gameObject);
        switch (Constructor.name) {
          case "Platform":
          case "MovingPlatform":
            this.currentObject = gameObject;
            break;
          default:
            this.currentObject = null;
            break;
        }
        break;
      default:
        break;
    }
  };

  CreationTool.prototype.handleMouseUp = function handleMouseUp(e) {
    switch (e.button) {
      case 0: // left mouse button
        this.canvas.style.cursor = "";
        break;
      case 2: // right mouse button
        this.clickedObject = null;
        break;
      default:
        break;
    }
  };

  CreationTool.prototype.handleMouseMove = function handleMouseMove(e) {
    var clickGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.clickX,
      this.mouse.clickY
    );
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var mouseGameDisplacement = SDK.Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );

    // move this.camera when mouse wheel is held down
    if (this.mouse.buttons[0]) {
      if (this.currentObject) {
        this.currentObject.width = Math.max(0, mouseGameDisplacement.x);
        this.currentObject.height = Math.max(0, mouseGameDisplacement.y);
      }
    }
  };

  return CreationTool;
})();

module.exports = CreationTool;


/***/ }),

/***/ "./js/levelEditor/gameLevelEditor.js":
/*!*******************************************!*\
  !*** ./js/levelEditor/gameLevelEditor.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CreationTool = __webpack_require__(/*! ./creationTool */ "./js/levelEditor/creationTool.js");
var SelectionTool = __webpack_require__(/*! ./selectionTool */ "./js/levelEditor/selectionTool.js");
var KeyboardManager = __webpack_require__(/*! ./keyboardManager */ "./js/levelEditor/keyboardManager.js");
var LevelManager = __webpack_require__(/*! ../game/levelManager */ "./js/game/levelManager.js");
var Toolbar = __webpack_require__(/*! ./toolbar */ "./js/levelEditor/toolbar.js");
var ToolManager = __webpack_require__(/*! ./toolManager */ "./js/levelEditor/toolManager.js");
window.gameData = __webpack_require__(/*! ../game/gameData.json */ "./js/game/gameData.json");

var LevelEditor = (function() {
  function LevelEditor(options) {
    this.data = {};
  }

  LevelEditor.prototype.init = function(config) {
    this.shouldDisplayRulers =
      config.shouldDisplayRulers !== undefined
        ? config.shouldDisplayRulers
        : true;
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.keyboard = new KeyboardManager(this);
    this.mouse = new SDK.MouseManager(this);
    this.soundManager = new SDK.SoundManager(gameData);
    this.levelManager = new LevelManager(this);
    this.gameObjects = [];
    this.camera = new SDK.Camera({
      zoomLevel: 0.05,
      worldRect: this.worldRect,
      canvas: this.canvas
    });
    this.grid = new SDK.Grid({
      options: {
        shouldDisplayRulers: config.shouldDisplayRulers,
        isGame: false
      },
      camera: this.camera,
      canvas: this.canvas,
      mouse: this.mouse
    });
    this.selectionTool = new SelectionTool({
      gameObjects: this.gameObjects,
      camera: this.camera,
      mouse: this.mouse,
      grid: this.grid,
      canvas: this.canvas
    });
    this.creationTool = new CreationTool({
      gameObjects: this.gameObjects,
      camera: this.camera,
      mouse: this.mouse,
      grid: this.grid,
      canvas: this.canvas
    });
    this.tools = {
      0: this.selectionTool,
      1: this.creationTool
    };
    this.toolManager = new ToolManager({
      mouse: this.mouse,
      canvas: this.canvas,
      tools: this.tools
    });
    this.toolbar = new Toolbar({ app: this, tools: this.tools });
  };

  LevelEditor.prototype.loadGameDataFromLocalStorage = function() {
    var savedData = localStorage.getItem("gameData");
    if (savedData) {
      gameData = JSON.parse(savedData);
    }
  };

  LevelEditor.prototype.buildLevel = function(name) {
    this.level = this.levelManager.buildLevel(name);
    this.countdownStart = this.level.countdownStart;
    this.worldRect = this.level.worldRect;
    this.gameObjects.length = 0; // clear the array without reassigning
    Array.prototype.push.apply(
      this.gameObjects,
      [].concat(
        this.level.player,
        this.level.platforms,
        this.level.ennemies,
        this.level.skills
      )
    );
    this.updateToolbar();
  };

  LevelEditor.prototype.updateToolbar = function() {
    emptyElement(this.toolbar.loadLevelSelect);
    var levelSelectionOptions = [h("option", { value: "" }, "")].concat(
      Object.keys(gameData.levels).map(function(item) {
        return h("option", { id: item, value: item }, item);
      })
    );
    levelSelectionOptions.forEach(function(option) {
      this.toolbar.loadLevelSelect.appendChild(render(option));
    }, this);
    if (this.level) {
      this.toolbar.loadLevelSelect.value = this.level.name;
      this.toolbar.levelNameInput.value = this.level.name;
      this.toolbar.countdownInput.value = this.level.countdownStart;
      this.toolbar.worldXInput.value = this.level.worldRect.x;
      this.toolbar.worldYInput.value = this.level.worldRect.y;
      this.toolbar.worldWidthInput.value = this.level.worldRect.width;
      this.toolbar.worldHeightInput.value = this.level.worldRect.height;
    }
  };

  LevelEditor.prototype.handleKeyboard = function() {};

  LevelEditor.prototype.updateScene = function() {
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
    this.grid.draw(ctx, this.camera, {
      shouldDisplayRulers: this.shouldDisplayRulers
    });
  };

  LevelEditor.prototype.drawSelectionRectangle = function(ctx, camera) {
    var selectionArea = this.selectionTool.selectionArea;
    if (selectionArea) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(
        camera.applyToX(selectionArea.x),
        camera.applyToY(selectionArea.y),
        camera.applyToDistance(selectionArea.width),
        camera.applyToDistance(selectionArea.height)
      );
      ctx.restore();
    }
  };

  LevelEditor.prototype.drawSelectionOutlines = function(ctx, camera) {
    var selectedObjects = this.selectionTool.selection.map(function(item) {
      return item.object;
    });

    if (!selectedObjects || selectedObjects.length === 0) return;

    var selectionRectangle = this.selectionTool.getSelectionBoundingRect();
    var lineWidth = 1;

    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth; // do not scale line width for visibility reasons
    ctx.beginPath();
    ctx.rect(
      camera.applyToX(selectionRectangle.x),
      camera.applyToY(selectionRectangle.y),
      camera.applyToDistance(selectionRectangle.width),
      camera.applyToDistance(selectionRectangle.height)
    );
    ctx.stroke();

    selectedObjects.forEach(function(selectedObject) {
      ctx.beginPath();
      ctx.rect(
        camera.applyToX(selectedObject.x) - lineWidth / 2,
        camera.applyToY(selectedObject.y) - lineWidth / 2,
        camera.applyToDistance(selectedObject.width) + lineWidth,
        camera.applyToDistance(selectedObject.height) + lineWidth
      );
      ctx.stroke();
    });
    ctx.restore();
  };

  LevelEditor.prototype.drawResizeHandles = function(ctx, camera) {
    if (!this.selectionTool.selection.length) {
      return;
    }

    var selectionRectangle = this.selectionTool.getSelectionBoundingRect();

    ctx.save();
    ctx.fillStyle = this.tools[0].resizeHandleHovered ? "cyan" : "blue";
    ctx.fillRect(
      camera.applyToX(selectionRectangle.right),
      camera.applyToY(selectionRectangle.bottom),
      20,
      20
    );
    ctx.restore();
  };

  LevelEditor.prototype.renderScene = function(ctx, camera) {
    // optimize rendering by only drawing objects that are on screen
    this.drawGrid(ctx, camera);

    // draw game objects
    this.gameObjects.forEach(function(gameObject) {
      gameObject.getBoundingRect().overlaps(camera) &&
        gameObject.draw(ctx, camera);

      // draw the end state of moving platforms
      if (gameObject.constructor.name === "MovingPlatform") {
        ctx.save();
        var lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = gameObject.color;
        ctx.strokeStyle = "red";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.rect(
          camera.applyToX(gameObject.xEnd) + lineWidth / 2,
          camera.applyToY(gameObject.yEnd) + lineWidth / 2,
          camera.applyToDistance(gameObject.width) - lineWidth,
          camera.applyToDistance(gameObject.height) - lineWidth
        );
        ctx.stroke();
        ctx.fill();

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          camera.applyToX(gameObject.center.x),
          camera.applyToY(gameObject.center.y)
        );
        ctx.lineTo(
          camera.applyToX(gameObject.xEnd + gameObject.width / 2),
          camera.applyToY(gameObject.yEnd + gameObject.height / 2)
        );
        ctx.stroke();
        ctx.restore();
      }
    });

    // draw selection rectangle
    this.drawSelectionRectangle(ctx, camera);
    this.drawSelectionOutlines(ctx, camera);
    this.drawResizeHandles(ctx, camera);

    // draw worldRect
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.strokeRect(
      camera.applyToX(this.worldRect.x),
      camera.applyToY(this.worldRect.y),
      camera.applyToDistance(this.worldRect.width),
      camera.applyToDistance(this.worldRect.height)
    );
    ctx.stroke();

    ctx.restore();
  };

  LevelEditor.prototype.start = function() {
    // initialize world size
    this.worldRect = new SDK.Rectangle({
      x: -5000,
      y: -5000,
      width: 10000,
      height: 10000
    });
    this.camera.updateDimensions();
    this.camera.x = this.worldRect.center.x - this.camera.width / 2;
    this.camera.y = this.worldRect.center.y - this.camera.height / 2;

    // local storage
    this.loadGameDataFromLocalStorage();
    // this.buildLevel();
    this.updateToolbar();
    this.main();
  };

  LevelEditor.prototype.main = function() {
    var camera = this.camera;
    dt = this.updateTimeEllapsed();
    // this.handleKeyboard();
    this.updateScene();
    this.clearCanvas(this.ctx, camera);
    this.renderBackground(this.ctx, camera);
    this.renderScene(this.ctx, camera);

    requestAnimationFrame(this.main.bind(this));
  };

  LevelEditor.prototype.generateJSONdata = function() {
    var gameObjects = this.gameObjects;

    // level name
    this.data.name = this.toolbar.levelNameInput.value;

    // level name
    this.data.countdownStart = parseInt(this.toolbar.countdownInput.value);

    // worldRect
    this.data.worldRect = {
      type: "Rectangle",
      props: {
        x: this.worldRect.x,
        y: this.worldRect.y,
        width: this.worldRect.width,
        height: this.worldRect.height
      }
    };

    // player
    var player = gameObjects.filter(function(gameObject) {
      return gameObject.constructor.name === "Player";
    })[0];
    if (!player) {
      alert("You must add at least one player");
      return false;
    }
    this.data.player = player
      ? {
          type: "Player",
          props: {
            x: player.x,
            y: player.y,
            color: player.color
          }
        }
      : null;

    // platforms
    this.data.platforms = [];
    var platforms = gameObjects.filter(function(gameObject) {
      return (
        gameObject.constructor.name === "Platform" ||
        gameObject.constructor.name === "MovingPlatform"
      );
    });
    platforms.forEach(function(gameObject) {
      var constructorName = gameObject.constructor.name;
      var platformData = {
        type: constructorName,
        props: {
          width: gameObject.width,
          height: gameObject.height
        }
      };
      platformData.props.x = gameObject.x;
      platformData.props.y = gameObject.y;

      if (constructorName === "MovingPlatform") {
        platformData.props.xStart = gameObject.xStart;
        platformData.props.yStart = gameObject.yStart;
        platformData.props.xEnd = gameObject.xEnd;
        platformData.props.yEnd = gameObject.yEnd;
      }
      this.data.platforms.push(platformData);
    }, this);

    // ennemies
    this.data.ennemies = [];
    var ennemies = gameObjects.filter(function(gameObject) {
      return gameObject.constructor.name === "Ennemy";
    });
    ennemies.forEach(function(ennemy) {
      var ennemyData = {
        type: "Ennemy",
        props: {
          x: ennemy.x,
          y: ennemy.y,
          width: ennemy.width,
          height: ennemy.height
        }
      };
      this.data.ennemies.push(ennemyData);
    }, this);

    // skills
    this.data.skills = [];
    var skills = gameObjects.filter(function(gameObject) {
      return gameObject.constructor.name.startsWith("Skill");
    });
    skills.forEach(function(skill) {
      var skillData = {
        type: skill.constructor.name,
        props: {
          x: skill.x,
          y: skill.y,
          width: skill.width,
          height: skill.height
        }
      };
      this.data.skills.push(skillData);
    }, this);

    return true;
  };

  LevelEditor.prototype.saveToLocalStorage = function() {
    if (this.generateJSONdata()) {
      gameData.levels[this.data.name] = this.data;
      var json = JSON.stringify(gameData);
      localStorage.setItem("gameData", json);
      this.updateToolbar();
    }
  };

  return LevelEditor;
})();

module.exports = LevelEditor;


/***/ }),

/***/ "./js/levelEditor/keyboardManager.js":
/*!*******************************************!*\
  !*** ./js/levelEditor/keyboardManager.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var KeyboardManager = (function() {
  function KeyboardManager(game) {
    // reference to the game object
    this.game = game;

    var codeMappings = {
      ArrowLeft: "LEFT",
      ArrowUp: "UP",
      ArrowRight: "RIGHT",
      ArrowDown: "DOWN",
      KeyW: "UP",
      KeyA: "LEFT",
      KeyS: "DOWN",
      KeyD: "RIGHT",
      Enter: "ENTER",
      Space: "SPACE",
      Escape: "ESCAPE"
    };
    var keyCodeMappings = {
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      90: "UP",
      81: "LEFT",
      93: "DOWN",
      68: "RIGHT",
      13: "ENTER",
      32: "SPACE",
      27: "ESCAPE"
    };

    window.addEventListener("keydown", this.handleKeydown.bind(this));

    this.keyRepeat = {};
  }

  KeyboardManager.prototype.handleKeydown = function handleKeydown(event) {
    var mouseGamePosSnappedToGrid = this.game.grid.getMouseGamePosSnappedToGrid(
      this.game.mouse.x,
      this.game.mouse.y
    );

    switch (event.keyCode) {
      case 46: // Delete
        var selection = this.game.tools[0].selection;
        if (selection.length) {
          while (selection[0]) {
            var selectedObject = selection[0].object;
            var gameObjectIndex = this.game.gameObjects.indexOf(selectedObject);
            gameObjectIndex >= 0 &&
              this.game.gameObjects.splice(gameObjectIndex, 1);
            selection.shift();
          }
        }
        break;
      case 27: // Escape
        this.game.tools[0].selection = [];
        break;
      case 65: // A key
        this.game.toolManager.tool = 0; // switch to selection context
        if (event.ctrlKey) {
          event.preventDefault();
          this.game.tools[0].selection = this.game.gameObjects.map(function(
            obj
          ) {
            return {
              object: obj,
              objectStart: Object.assign({}, obj)
            };
          });
        }
        break;
      case 83:
        this.game.toolManager.tool = 0;
        break;
      case 67:
        this.game.toolManager.tool = 1;
        this.game.toolbar.objectTypeDropDown.focus();
        break;
      case 37:
        this.game.camera.x -= 20 / this.game.camera.zoomLevel;
        break;
      case 38:
        this.game.camera.y -= 20 / this.game.camera.zoomLevel;
        break;
      case 39:
        this.game.camera.x += 20 / this.game.camera.zoomLevel;
        break;
      case 40:
        this.game.camera.y += 20 / this.game.camera.zoomLevel;
        break;
      case 187:
        event.preventDefault();
        event.shiftKey
          ? this.game.camera.zoomOut(
              mouseGamePosSnappedToGrid.x,
              mouseGamePosSnappedToGrid.y
            )
          : this.game.camera.zoomIn(
              mouseGamePosSnappedToGrid.x,
              mouseGamePosSnappedToGrid.y
            );
        break;
      default:
    }
  };

  return KeyboardManager;
})();

module.exports = KeyboardManager;


/***/ }),

/***/ "./js/levelEditor/selectionTool.js":
/*!*****************************************!*\
  !*** ./js/levelEditor/selectionTool.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var SelectionTool = (function() {
  function SelectionTool(props) {
    this.gameObjects = props.gameObjects;
    this.camera = props.camera;
    this.mouse = props.mouse;
    this.grid = props.grid;
    this.canvas = props.canvas;

    this.selection = [];
    this.clickedObject = null;
    this.selectionArea = null;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.eventHandlers = {
      mouse: {
        mousedown: {
          handler: this.handleMouseDown,
          props: undefined
        },
        mouseup: {
          handler: this.handleMouseUp,
          props: undefined
        },
        mousemove: {
          handler: this.handleMouseMove,
          props: undefined
        }
      }
    };
  }

  SelectionTool.prototype.getSelectionBoundingRect = function() {
    var selectedObjects = this.selection.map(function(item) {
      return item.object;
    });
    var left = Math.min.apply(
      null,
      selectedObjects.map(function(obj) {
        return obj.getBoundingRect().left;
      })
    );
    var top = Math.min.apply(
      null,
      selectedObjects.map(function(obj) {
        return obj.getBoundingRect().top;
      })
    );
    var width =
      Math.max.apply(
        null,
        selectedObjects.map(function(obj) {
          return obj.getBoundingRect().right;
        })
      ) - left;
    var height =
      Math.max.apply(
        null,
        selectedObjects.map(function(obj) {
          return obj.getBoundingRect().bottom;
        })
      ) - top;
    return new SDK.Rectangle({ x: left, y: top, width: width, height: height });
  };

  SelectionTool.prototype.handleMouseDown = function handleMouseDown(e) {
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var newSelection = [];

    switch (e.button) {
      case 0:
        // check if the player clicked a resize handle
        this.resizeHandleClicked = this.isMouseInsideResizeHandle();
        if (this.resizeHandleClicked) return;

        // find the most recently added game object the click was inside of
        this.clickedObject = this.getClickedObject(
          mouseGamePosSnappedToGrid.x,
          mouseGamePosSnappedToGrid.y
        );

        if (this.clickedObject) {
          newSelection = [
            {
              object: this.clickedObject,
              objectStart: Object.assign({}, this.clickedObject) // copy
            }
          ];
        }

        // check if clicked object already belongs to a previous selection
        var selectionObjects = this.selection.map(function(item) {
          return item.object;
        });
        if (
          this.clickedObject &&
          selectionObjects.includes(this.clickedObject)
        ) {
          newSelection = this.selection;
        }

        this.selection = newSelection;

        // create selection area if no object was selected
        if (!this.clickedObject) {
          this.selectionArea = new SDK.Rectangle({
            x: mouseGamePosSnappedToGrid.x,
            y: mouseGamePosSnappedToGrid.y
          });
        }
        break;
      case 2:
        var clickedObject = this.getClickedObject(
          mouseGamePosSnappedToGrid.x,
          mouseGamePosSnappedToGrid.y
        );
        if (
          clickedObject &&
          clickedObject.constructor.name === "MovingPlatform"
        ) {
          this.clickedObject = clickedObject;
        }
        break;
      default:
        break;
    }
  };

  SelectionTool.prototype.isMouseInsideResizeHandle = function() {
    if (this.selection) {
      var selectionRectangle = this.getSelectionBoundingRect();
      var resizeHandlePos = this.camera.apply(
        selectionRectangle.right,
        selectionRectangle.bottom
      );
      var resizeHandleRectangle = new SDK.Rectangle({
        x: resizeHandlePos.x,
        y: resizeHandlePos.y,
        width: 20,
        height: 20
      });

      return resizeHandleRectangle.contains(this.mouse.x, this.mouse.y);
    }
  };

  SelectionTool.prototype.getClickedObject = function(x, y) {
    var clickedObject = null;
    for (var i = 0; i < this.gameObjects.length; i++) {
      var gameObject = this.gameObjects[i];
      if (gameObject.getBoundingRect().contains(x, y)) {
        clickedObject = gameObject;
      }
    }
    return clickedObject;
  };

  SelectionTool.prototype.handleMouseMove = function handleMouseMove(e) {
    var clickGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.clickX,
      this.mouse.clickY
    );
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var mouseGameDisplacement = SDK.Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );
    // no button down and mouse is inside a resize handle
    if (
      !this.mouse.buttons[0] &&
      !this.mouse.buttons[1] &&
      !this.mouse.buttons[2]
    ) {
      this.resizeHandleHovered = this.isMouseInsideResizeHandle();
      return;
    }
    // left button down
    if (this.mouse.buttons[0]) {
      // resize selection objects if resize handle was clicked
      if (this.resizeHandleClicked) {
        this.resizeSelectedObjects(
          mouseGameDisplacement.x,
          mouseGameDisplacement.y
        );
        return;
      }
      if (this.selectionArea) {
        this.selectionArea.width = mouseGameDisplacement.x;
        this.selectionArea.height = mouseGameDisplacement.y;
      } else {
        this.moveSelectedObjects(
          mouseGameDisplacement.x,
          mouseGameDisplacement.y
        );
      }
    }
    // right button down
    if (this.mouse.buttons[2]) {
      if (this.clickedObject) {
        this.clickedObject.xEnd =
          this.clickedObject.xStart + mouseGameDisplacement.x;
        this.clickedObject.yEnd =
          this.clickedObject.yStart + mouseGameDisplacement.y;
      }
    }
  };

  SelectionTool.prototype.resizeSelectedObjects = function(dx, dy) {
    this.selection.forEach(function(item) {
      item.object.width = item.objectStart.width + dx;
      item.object.height = item.objectStart.height + dy;
    });
  };

  SelectionTool.prototype.moveSelectedObjects = function(dx, dy) {
    this.selection.forEach(function(item) {
      item.object.x = item.objectStart.x + dx;
      item.object.y = item.objectStart.y + dy;
      item.object.xStart = item.objectStart.xStart + dx;
      item.object.yStart = item.objectStart.yStart + dy;
      item.object.xEnd = item.objectStart.xEnd + dx;
      item.object.yEnd = item.objectStart.yEnd + dy;
    });
  };

  SelectionTool.prototype.handleMouseUp = function handleMouseUp(e) {
    switch (e.button) {
      case 0: // left button up
        if (this.resizeHandleClicked) {
          this.resizeHandleClicked = false; // release handle
          this.selection.forEach(function(item) {
            item.objectStart.width = item.object.width;
            item.objectStart.height = item.object.height;
          });
          return;
        }

        if (this.selection.length) {
          if (
            this.mouse.releaseX === this.mouse.clickX &&
            this.mouse.releaseY === this.mouse.clickY
          ) {
            // If click and release at the same spot, select the most recently added game object the click was inside of
            this.selection = [
              {
                object: this.clickedObject
              }
            ];
          }

          this.selection.forEach(function(item) {
            item.objectStart = Object.assign({}, item.object);
          });

          return;
        }

        if (this.selectionArea) {
          // which objects are in the selection area?
          this.selection = [];
          this.gameObjects.forEach(
            function(obj) {
              if (obj.getBoundingRect().overlaps(this.selectionArea)) {
                this.selection.push({
                  object: obj,
                  objectStart: Object.assign({}, obj)
                });
              }
            }.bind(this)
          );
          this.selectionArea = null;
        }
        break;
      case 2:
        if (this.selection.length && this.clickedObject) {
          this.selection[0].objectStart.xEnd = this.clickedObject.xEnd;
          this.selection[0].objectStart.yEnd = this.clickedObject.yEnd;
        }
        this.clickedObject = null;
        break;
      default:
        break;
    }
  };

  return SelectionTool;
})();

module.exports = SelectionTool;


/***/ }),

/***/ "./js/levelEditor/toolManager.js":
/*!***************************************!*\
  !*** ./js/levelEditor/toolManager.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function ToolManager(props) {
  this.tools = props.tools;
  this.mouse = props.mouse;
  this.canvas = props.canvas;
  this.toolID = 0;
  this.setEventHandlersForTool(this.toolID);
}

Object.defineProperties(ToolManager.prototype, {
  tool: {
    get: function() {
      return this.toolID;
    },
    set: function(id) {
      if (id !== this.toolID) {
        this.unsetEventHandlersForTool(this.toolID);
        this.setEventHandlersForTool(id);
        this.toolID = id;
      }
    }
  }
});

ToolManager.prototype.unsetEventHandlersForTool = function(id) {
  var entries = Object.entries(this.tools[id].eventHandlers.mouse);
  for (var i = 0; i < entries.length; i++) {
    var key = entries[i][0];
    var value = entries[i][1];
    this.mouse.off(this.canvas, key, value.handler, value.props);
  }
};

ToolManager.prototype.setEventHandlersForTool = function(id) {
  var entries = Object.entries(this.tools[id].eventHandlers.mouse);
  for (var i = 0; i < entries.length; i++) {
    var key = entries[i][0];
    var value = entries[i][1];
    this.mouse.on(this.canvas, key, value.handler, value.props);
  }
};

module.exports = ToolManager;


/***/ }),

/***/ "./js/levelEditor/toolbar.js":
/*!***********************************!*\
  !*** ./js/levelEditor/toolbar.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Player = __webpack_require__(/*! ../game/player */ "./js/game/player.js");
var Ennemy = __webpack_require__(/*! ../game/ennemy */ "./js/game/ennemy.js");
var Platform = __webpack_require__(/*! ../game/platform */ "./js/game/platform.js");
var MovingPlatform = __webpack_require__(/*! ../game/movingPlatform */ "./js/game/movingPlatform.js");
var skills = __webpack_require__(/*! ../game/skills */ "./js/game/skills.js");
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

var Toolbar = (function() {
  function Toolbar(props) {
    this.el = document.getElementById("toolbar");
    this.loadLevelSelect = document.getElementById("load");
    this.levelNameInput = document.getElementById("level-name");
    this.countdownInput = document.getElementById("level-countdown");
    this.worldXInput = document.getElementById("world-x");
    this.worldYInput = document.getElementById("world-y");
    this.worldWidthInput = document.getElementById("world-width");
    this.worldHeightInput = document.getElementById("world-height");
    this.selectButton = document.getElementById("button-select");
    this.createButton = document.getElementById("button-create");
    this.objectTypeDropDown = document.getElementById("object-type");
    this.saveButton = document.getElementById("save-button");
    this.deleteButton = document.getElementById("delete-button");

    this.deleteButton.addEventListener(
      "click",
      function(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        var currentLevelName = this.loadLevelSelect.value;
        var confirmDelete = window.confirm(
          "Are you sure you want to delete the current level?"
        );
        if (confirmDelete && gameData.levels[currentLevelName]) {
          delete gameData.levels[currentLevelName];
          localStorage.setItem("gameData", JSON.stringify(gameData));
          this.app.start();
        }
      }.bind(this)
    );
    this.loadLevelSelect.addEventListener(
      "change",
      function(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        e.target.value === "" && this.app.start();
        e.target.value !== "" && this.app.buildLevel(e.target.value);
      }.bind(this)
    );
    this.worldXInput.addEventListener(
      "change",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.worldRect.x = parseInt(e.target.value);
      }.bind(this)
    );
    this.worldYInput.addEventListener(
      "change",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.worldRect.y = parseInt(e.target.value);
      }.bind(this)
    );
    this.worldWidthInput.addEventListener(
      "change",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.worldRect.width = parseInt(e.target.value);
      }.bind(this)
    );
    this.worldHeightInput.addEventListener(
      "change",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.worldRect.height = parseInt(e.target.value);
      }.bind(this)
    );
    this.selectButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.toolManager.tool = 0;
      }.bind(this)
    );
    this.createButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.toolManager.tool = 1;
      }.bind(this)
    );
    this.saveButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.saveToLocalStorage();
      }.bind(this)
    );

    this.objectTypeDropDown.addEventListener(
      "change",
      function(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        this.objectTypeDropDown.focus();
        var app = this.app;
        var objectType = this.getGameObjectType();
        app.toolManager.tool = 1;
        switch (objectType) {
          case "Player":
          case "Ennemy":
          case "SkillHtml":
          case "SkillCss":
          case "SkillSass":
          case "SkillBootstrap":
          case "SkillJquery":
          case "SkillReact":
          case "SkillAngular":
          case "SkillMongo":
          case "SkillNode":
          case "SkillMeteor":
            app.toolManager.tool = 1;
            break;
          case "Platform":
          case "MovingPlatform":
            app.toolManager.tool = 2;
            break;
          default:
            break;
        }
      }.bind(this)
    );

    this.tools = props.tools;
    this.app = props.app;
    this.getGameObjectType();
  }

  Toolbar.prototype.getGameObjectType = function() {
    var app = this.app;
    var type = this.objectTypeDropDown.value;
    var objectTypeMap = {
      player: Player,
      platform: Platform,
      movingPlatform: MovingPlatform,
      ennemy: Ennemy,
      skillHtml: SkillHtml,
      skillCss: SkillCss,
      skillSass: SkillSass,
      skillBootstrap: SkillBootstrap,
      skillJquery: SkillJquery,
      skillReact: SkillReact,
      skillAngular: SkillAngular,
      skillNode: SkillNode,
      skillMongo: SkillMongo,
      skillMeteor: SkillMeteor
    };
    this.tools[1].gameObjectConstructor = objectTypeMap[type];
  };

  return Toolbar;
})();

module.exports = Toolbar;


/***/ })

/******/ });
//# sourceMappingURL=level-editor.js.map