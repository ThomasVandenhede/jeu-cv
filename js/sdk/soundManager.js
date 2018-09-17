class SoundManager {
  constructor({ gameData }) {
    if (!SoundManager.instance) {
      SoundManager.instance = this;
    }
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
    files.forEach(
      function(file) {
        var filename = file.filename;

        var sound = new Sound(location + filename);
        sound.volume = file.volume * this.masterVolume;

        this.sounds[filename] = sound;
      }.bind(this)
    );

    location = musicData.location;
    files = musicData.files;
    // load musics
    files.forEach(
      function(file) {
        var filename = file.filename;

        var sound = new Sound(location + filename);
        sound.volume = file.volume * this.masterVolume;

        this.sounds[filename] = sound;
      }.bind(this)
    );

    return SoundManager.instance;
  }

  stopAll() {
    for (var sound in this.sounds) {
      sound.stop();
    }
  }

  pauseAll() {
    for (var sound in this.sounds) {
      if (sound.isPlaying) {
        this.pausedSounds.push(sound);
        sound.pause();
      }
    }
  }

  playPaused() {
    this.pausedSounds.forEach(function(pausedSound) {
      pausedSound.play();
    });
  }
}
