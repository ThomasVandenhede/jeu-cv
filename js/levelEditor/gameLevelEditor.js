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
    this.backgroundCanvas = document.getElementById("background");
    this.camera = new Camera({
      x: -1000,
      y: -1000,
      zoomLevel: 0.05,
      worldRect: this.worldRect
    });
    this.ctx = this.canvas.getContext("2d");
    this.bgCtx = this.backgroundCanvas.getContext("2d");
    this.keyboard = keyboardManager.getInstance();
    this.keyboard.init(this);
    this.mouse = mouse.getInstance();
    this.mouse.init(this); // pass the game object to the mouse as its context
    this.contextManager = contextManager.getInstance();
    this.contextManager.init(this);
    this.toolbar = toolbarFactory.getInstance();
    this.toolbar.init(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);
    this.grid = new Grid({
      camera: this.camera,
      canvas: this.canvas,
      mouse: this.mouse
    });

    // contexts
    this.contexts = {};

    // initialize world size
    this.worldRect = new AABB({ x: 0, y: 0, width: 10000, height: 10000 });

    // initialize world objects
    this.gameObjects = [];

    // initialize background
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
  };

  LevelEditor.prototype.handleKeyboard = function() {};

  LevelEditor.prototype.updateScene = function() {
    // update objects to be rendered
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
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var selectionArea = this.mouse.selectionArea;
    if (selectionArea) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(selectionArea.x, selectionArea.y).concat([
          selectionArea.width * camera.zoomLevel,
          selectionArea.height * camera.zoomLevel
        ])
      );
      ctx.restore();
    }
  };

  LevelEditor.prototype.getSelectionBoundingRect = function() {
    var left = Math.min.apply(
      null,
      this.mouse.selectedObjects.map(function(selectedObject) {
        return selectedObject.getBoundingRect().left;
      })
    );
    var top = Math.min.apply(
      null,
      this.mouse.selectedObjects.map(function(selectedObject) {
        return selectedObject.getBoundingRect().top;
      })
    );
    var width =
      Math.max.apply(
        null,
        this.mouse.selectedObjects.map(function(selectedObject) {
          return selectedObject.getBoundingRect().right;
        })
      ) - left;
    var height =
      Math.max.apply(
        null,
        this.mouse.selectedObjects.map(function(selectedObject) {
          return selectedObject.getBoundingRect().bottom;
        })
      ) - top;
    return new AABB({ x: left, y: top, width: width, height: height });
  };

  LevelEditor.prototype.drawSelectionOutlines = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var applyCam = camera.apply.bind(camera);
    var selectedObjects = this.mouse.selectedObjects;

    if (!selectedObjects || selectedObjects.length === 0) return;

    var selectionRectangle = this.getSelectionBoundingRect();
    var lineWidth = 1;

    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth; // do not scale line width for visibility reasons
    ctx.beginPath();
    ctx.rect.apply(
      ctx,
      applyCamToArr(selectionRectangle.x, selectionRectangle.y).concat([
        selectionRectangle.width * camera.zoomLevel,
        selectionRectangle.height * camera.zoomLevel
      ])
    );
    ctx.stroke();

    selectedObjects.forEach(function(selectedObject) {
      ctx.beginPath();
      ctx.rect.apply(
        ctx,
        Object.values(
          Vector.subtract(
            applyCam(selectedObject.x, selectedObject.y),
            new Vector(lineWidth / 2, lineWidth / 2)
          )
        ).concat([
          selectedObject.width * camera.zoomLevel + lineWidth,
          selectedObject.height * camera.zoomLevel + lineWidth
        ])
      );
      ctx.stroke();
    });
    ctx.restore();
  };

  LevelEditor.prototype.drawResizeHandles = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    var applyCam = camera.apply.bind(camera);
    var selectedObjects = this.mouse.selectedObjects;

    if (!selectedObjects || selectedObjects.length === 0) return;

    var selectionRectangle = this.getSelectionBoundingRect();

    ctx.save();
    ctx.fillStyle = "blue";
    ctx.fillRect.apply(
      ctx,
      applyCamToArr(selectionRectangle.right, selectionRectangle.bottom).concat(
        [20, 20]
      )
    );
    ctx.restore();
  };

  LevelEditor.prototype.renderScene = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };

    // draw game objects
    this.gameObjects.forEach(function(gameObject) {
      gameObject.overlaps(camera) && gameObject.draw(ctx, camera);

      // draw the end state of moving platforms
      if (gameObject.constructor.name === "MovingPlatform") {
        var lineWidth = 2;
        ctx.save();
        ctx.strokeStyle = gameObject.color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.strokeRect.apply(
          ctx,
          Object.values(
            Vector.sum(
              camera.apply(gameObject.xEnd, gameObject.yEnd),
              new Vector(lineWidth / 2, lineWidth / 2)
            )
          ).concat([
            gameObject.width * camera.zoomLevel - lineWidth,
            gameObject.height * camera.zoomLevel - lineWidth
          ])
        );

        // joining line TOP LEFT
        ctx.beginPath();
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(gameObject.xStart, gameObject.yStart)
        );
        ctx.lineTo.apply(ctx, applyCamToArr(gameObject.xEnd, gameObject.yEnd));
        ctx.stroke();

        // joining line TOP RIGHT
        ctx.beginPath();
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(gameObject.xStart + gameObject.width, gameObject.yStart)
        );
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(gameObject.xEnd + gameObject.width, gameObject.yEnd)
        );
        ctx.stroke();

        // joining line BOTTOM RIGHT
        ctx.beginPath();
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(
            gameObject.xStart + gameObject.width,
            gameObject.yStart + gameObject.height
          )
        );
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(
            gameObject.xEnd + gameObject.width,
            gameObject.yEnd + gameObject.height
          )
        );
        ctx.stroke();

        // joining line BOTTOM LEFT
        ctx.beginPath();
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(
            gameObject.xStart,
            gameObject.yStart + gameObject.height
          )
        );
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(gameObject.xEnd, gameObject.yEnd + gameObject.height)
        );
        ctx.stroke();
        ctx.restore();
      }
    });

    // optimize rendering by only drawing objects that are on screen
    this.drawGrid(ctx, camera);

    // draw selection rectangle
    this.drawSelectionRectangle(ctx, camera);
    this.drawSelectionOutlines(ctx, camera);
    this.drawResizeHandles(ctx, camera);

    // draw worldRect
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.strokeRect.apply(
      ctx,
      applyCamToArr(this.worldRect.x, this.worldRect.y).concat([
        this.worldRect.width * camera.zoomLevel,
        this.worldRect.height * camera.zoomLevel
      ])
    );
    ctx.stroke();

    ctx.restore();
  };

  LevelEditor.prototype.start = function() {
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
      type: "AABB",
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
    platforms.forEach(
      function(gameObject) {
        var constructorName = gameObject.constructor.name;
        var platformData = {
          type: constructorName,
          props: {
            width: gameObject.width,
            height: gameObject.height
          }
        };
        if (constructorName === "Platform") {
          platformData.props.x = gameObject.x;
          platformData.props.y = gameObject.y;
        }
        if (constructorName === "MovingPlatform") {
          platformData.props.xStart = gameObject.xStart;
          platformData.props.yStart = gameObject.yStart;
          platformData.props.xEnd = gameObject.xEnd;
          platformData.props.yEnd = gameObject.yEnd;
        }
        this.data.platforms.push(platformData);
      }.bind(this)
    );

    // ennemies
    this.data.ennemies = [];
    var ennemies = gameObjects.filter(function(gameObject) {
      return gameObject.constructor.name === "Ennemy";
    });
    ennemies.forEach(
      function(ennemy) {
        var ennemyData = {
          type: "Ennemy",
          props: {
            x: ennemy.x,
            y: ennemy.y
          }
        };
        this.data.ennemies.push(ennemyData);
      }.bind(this)
    );

    // skills
    this.data.skills = [];
    var skills = gameObjects.filter(function(gameObject) {
      return gameObject.constructor.name === "Skill";
    });
    skills.forEach(
      function(skill) {
        var skillData = {
          type: "Skill",
          props: {
            x: skill.x,
            y: skill.y
          }
        };
        this.data.skills.push(skillData);
      }.bind(this)
    );

    return true;
  };

  LevelEditor.prototype.saveToLocalStorage = function() {
    if (this.generateJSONdata()) {
      gameData.levels[this.data.name] = this.data;
      console.log(
        "​LevelEditor.prototype.saveToLocalStorage -> gameData",
        gameData
      );
      var json = JSON.stringify(gameData);
      localStorage.setItem("gameData", json);
    }
  };

  return LevelEditor;
})();
