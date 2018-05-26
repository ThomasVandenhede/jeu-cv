var soundManager = (function() {
  var instance;

  function SoundManager() {
    this.masterVolume = 1;
    this.sounds = {};
    this.musics = {};
    this.pausedSounds = {};
  }

  SoundManager.prototype.init = function(gameData) {
    var soundData = gameData.sounds;
    var musicData = gameData.musics;
    var location, files;

    location = soundData.location;
    files = soundData.files;
    // load sounds
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }

    location = musicData.location;
    files = musicData.files;
    // load musics
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }
  };

  SoundManager.prototype.stopAll = function() {
    for (var sound in this.sounds) {
      sound.stop();
    }
  };

  SoundManager.prototype.pauseAll = function() {
    for (var sound in this.sounds) {
      if (sound.isPlaying) {
        this.pausedSounds.push(sound);
        sound.pause();
      }
    }
  };

  SoundManager.prototype.playPaused = function() {
    for (var i = 0; i < this.pausedSounds.length; i++) {
      var pausedSound = this.pausedSounds[i];
      pausedSound.play();
    }
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new SoundManager();
      }
      return instance;
    }
  };
})();
