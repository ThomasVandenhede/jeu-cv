var Sound = require("./sound");

var SoundManager = (function() {
  function SoundManager(gameData) {
    this.masterVolume = 1;
    this.sounds = {};
    this.musics = {};
    this.pausedSounds = [];

    var soundData = gameData.sounds;
    var musicData = gameData.musics;
    var location, files;

    location = soundData.location;
    files = soundData.files;

    // load sounds
    files.forEach(function(file) {
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }, this);

    location = musicData.location;
    files = musicData.files;

    // load musics
    files.forEach(function(file) {
      var filename = file.filename;

      var sound = new Sound(location + filename);
      sound.volume = file.volume * this.masterVolume;

      this.sounds[filename] = sound;
    }, this);
  }

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
    this.pausedSounds.forEach(function(pausedSound) {
      pausedSound.play();
    });
  };

  return SoundManager;
})();

module.exports = SoundManager;
