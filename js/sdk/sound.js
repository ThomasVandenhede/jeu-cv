function Sound(src, volume, options) {
  if (options) {
    this.sound.loop = options.loop || false;
    this.sound.isMusic = options.isMusic || false;
  }
  this.sound = new Audio(src);
  this.sound.volume = volume !== undefined ? volume : 1;
  this.isPlaying = false;
}

Sound.prototype.play = function() {
  this.sound.play();
  this.isPlaying = true;
};

Sound.prototype.pause = function() {
  this.sound.pause();
  this.isPlaying = true;
};

Sound.prototype.stop = function() {
  this.pause();
  this.rewind();
};

Sound.prototype.rewind = function() {
  this.sound.currentTime = 0;
};

Sound.prototype.replay = function() {
  this.rewind();
  this.play();
};
