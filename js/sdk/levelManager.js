var levelManager = (function() {
  var instance;

  function LevelManager(data) {
    this.data = data;
  }

  LevelManager.prototype.init = function() {
    var location = this.data.location;
    var files = this.data.files;

    files.forEach(function(file) {
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume;

      this.sounds[filename] = sound;
    });
  };

  LevelManager.prototype.stopAll = function() {
    for (var sound in this.sounds) {
      sound.stop();
    }
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new LevelManager(gameData.sounds);
      }
      return instance;
    }
  };
})();
