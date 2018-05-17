function Sound(src) {
  this.sound = new Audio(src);
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
