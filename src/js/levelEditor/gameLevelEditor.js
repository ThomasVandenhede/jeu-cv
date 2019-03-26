var CreationTool = require("./creationTool");
var SelectionTool = require("./selectionTool");
var KeyboardManager = require("./keyboardManager");
var LevelManager = require("../game/levelManager");
var Toolbar = require("./toolbar");
var ToolManager = require("./toolManager");
var utils = require('../utils');
window.gameData = require("../game/gameData.json");

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
    utils.emptyElement(this.toolbar.loadLevelSelect);
    var levelSelectionOptions = [utils.h("option", { value: "" }, "")].concat(
      Object.keys(gameData.levels).map(function(item) {
        return utils.h("option", { id: item, value: item }, item);
      })
    );
    levelSelectionOptions.forEach(function(option) {
      this.toolbar.loadLevelSelect.appendChild(utils.render(option));
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
