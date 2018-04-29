// Singleton pattern
var gameManager = (function () {
  var instance;

  function GameManager() {
    this.player;
    this.platforms;
    this.ennemies;
  };

  return {
    getInstance: function () {
      if ( !instance ) {
        instance = new GameManager();
      }
      return instance;
    }
  };
}());