var toolbarFactory = (function() {
  var instance = null;

  function Toolbar() {
    this.el = document.getElementById("toolbar");
    this.selectButton = document.getElementById("button-select");
    this.createButton = document.getElementById("button-create");
    this.moveButton = document.getElementById("button-move");
    this.downloadButton = document.getElementById("button-download");
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
    this.moveButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault();
        app.contextManager.context = 2;
      }.bind(this)
    );
    this.downloadButton.addEventListener(
      "click",
      function(e) {
        var app = this.app;
        e.preventDefault();
        app.getDownLink();
      }.bind(this)
    );

    this.objectTypeDropDown.addEventListener(
      "change",
      this.getGameObjectType.bind(this)
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
      movingPlatform: MovingPlatform
    };
    app.gameObjectConstructor = objectTypeMap[type];
    console.log(app.gameObjectConstructor);
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
