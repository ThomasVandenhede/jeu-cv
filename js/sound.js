function Sound(src, volume) {
  this.sound = new Audio(src);
  this.sound.volume = volume || 1;
}

Sound.prototype.play = function() {
  this.sound.play();
};

Sound.prototype.pause = function() {
  this.sound.pause();
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
