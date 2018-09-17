class Sound {
  constructor(src, volume, options) {
    if (options) {
      this.sound.loop = options.loop || false;
      this.sound.isMusic = options.isMusic || false;
    }
    this.sound = new Audio(src);
    this.sound.volume = volume !== undefined ? volume : 1;
    this.isPlaying = false;
  }

  play() {
    this.sound.play();
    this.isPlaying = true;
  }

  pause() {
    this.sound.pause();
    this.isPlaying = true;
  }

  stop() {
    this.pause();
    this.rewind();
  }

  rewind() {
    this.sound.currentTime = 0;
  }

  replay() {
    this.rewind();
    this.play();
  }
}
