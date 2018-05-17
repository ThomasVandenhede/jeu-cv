// Singleton pattern
var soundManager = (function() {
  var instance;

  function SounddManager() {
    var that = this;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = new SoundManager();
      }
      return instance;
    }
  };
})();
