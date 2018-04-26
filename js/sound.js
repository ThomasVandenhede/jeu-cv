function Sound(src) {
  this.sound = new Audio(src);
  // this.sound = document.createElement("audio");
  // this.sound.src = src;
  // this.sound.setAttribute("preload", "auto");
  // this.sound.setAttribute("controls", "none");
  // this.sound.style.display = "none";
  // document.body.appendChild(this.sound);
  console.log('' + this.sound);
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
}

Sound.prototype.replay = function() {
  this.rewind();
  this.play();
}
