var soundManager = (function () {
  var instance;

  function SoundManager() {
    this.sounds = {};
  }

  SoundManager.prototype.init = function (data) {
    this.data = data;
    var location = this.data.location;
    var files = this.data.files;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume;

      this.sounds[filename] = sound;
    }
  }

  SoundManager.prototype.stopAll = function () {
    for (var sound in this.sounds) {
      sound.stop();
    }
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = new SoundManager();
      }
      return instance;
    }
  };
})();
