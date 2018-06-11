var toolbarFactory = (function() {
  var instance = null;

  function Toolbar() {
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
        app.contextManager.context = 0;
      }.bind(this)
    );
    this.createButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        app.contextManager.context = 1;
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
        var app = this.app;
        var objectType = this.getGameObjectType();
        app.contextManager.context = 1;
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
            app.contextManager.context = 1;
            break;
          case "Platform":
          case "MovingPlatform":
            app.contextManager.context = 2;
            break;
          default:
            break;
        }
      }.bind(this)
    );
  }

  Toolbar.prototype.init = function(app) {
    this.app = app;
    this.getGameObjectType();
  };

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
    app.gameObjectConstructor = objectTypeMap[type];
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new Toolbar();
      }
      return instance;
    }
  };
})();
