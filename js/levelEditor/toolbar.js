var toolbarFactory = (function() {
  var instance = null;

  function Toolbar() {
    this.el = document.getElementById("toolbar");
    this.levelNameInput = document.getElementById("level-name");
    this.selectButton = document.getElementById("button-select");
    this.createButton = document.getElementById("button-create");
    this.saveButton = document.getElementById("save-button");
    this.objectTypeDropDown = document.getElementById("object-type");

    this.selectButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault();
        app.contextManager.context = 0;
      }.bind(this)
    );
    this.createButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault();
        app.contextManager.context = 1;
      }.bind(this)
    );
    this.saveButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault();
        app.saveToLocalStorage();
      }.bind(this)
    );

    this.objectTypeDropDown.addEventListener(
      "change",
      function(e) {
        var app = this.app;
        e.preventDefault();
        var objectType = this.getGameObjectType();
        switch (objectType) {
          case "Player":
          case "Ennemy":
          case "Skill":
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
      skill: Skill
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
