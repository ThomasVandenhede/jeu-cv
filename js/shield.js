var Shield = (function() {
  var MIN_SIZE = 0;
  var MAX_SIZE = 40;
  var opacity = 1;

  function Shield(shielded) {
    this.shielded = shielded || null; // object benefitting from the shield
    this.r = MIN_SIZE;
    this.isOpen = false;
    this.isAnimating = false;

    // timings
    this.openingDuration = 0.3;
    this.closingDuration = 0.6;

    // sounds
    this.sounds = {
      open: new Sound("./assets/sounds/Open.mp3", 0.3),
      close: new Sound("./assets/sounds/Close.mp3", 0.5)
    };
  }

  Shield.prototype.open = function() {
    this.sounds.close.stop();
    this.sounds.open.play();
    this.isOpen = true;
    this.isAnimating = true;
  };

  Shield.prototype.close = function() {
    this.sounds.open.stop();
    this.sounds.close.play();
    this.isOpen = false;
    this.isAnimating = true;
  };

  Shield.prototype.update = function(dt) {
    var dr;
    if (this.isOpen) {
      dr = (MAX_SIZE - MIN_SIZE) / this.openingDuration * dt;
      // shield opening
      if (this.r + dr < MAX_SIZE) {
        this.r += dr;
        opacity = (this.r - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);
      } else {
        this.r = MAX_SIZE;
        opacity = 1;
        this.isAnimating = false;
      }
    } else {
      dr = (MAX_SIZE - MIN_SIZE) / this.closingDuration * dt;
      // shield closing
      if (this.r - dr > MIN_SIZE) {
        this.r -= dr;
        opacity = (this.r - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);
        console.log(opacity);
      } else {
        this.r = MIN_SIZE;
        opacity = 0;
        this.isAnimating = false;
      }
    }
  };

  Shield.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.strokeStyle = this.shielded.color || "#fff";
    // ctx.strokeStyle = "rgba(255, 165, 0, " + opacity + ")";
    // ctx.strokeStyle = "rgba(128, 128, 128, " + opacity + ")";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      this.shielded.x + this.shielded.width / 2 - camera.x,
      this.shielded.y + this.shielded.height / 2 - camera.y,
      this.r,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.closePath();

    // fill shield
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.arc(
      this.shielded.x + this.shielded.width / 2 - camera.x,
      this.shielded.y + this.shielded.height / 2 - camera.y,
      this.r - 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  };

  Shield.prototype.draw = function(ctx, camera) {
    var r = 5 + this.r;
    var left = this.shielded.x - this.r - camera.x;
    var top = this.shielded.y - this.r - camera.y;
    var right = left + 2 * this.r + this.shielded.width;
    var bottom = top + 2 * this.r + this.shielded.height;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.strokeStyle = this.shielded.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, top + r);
    ctx.arcTo(left, top, left + r, top, r);
    ctx.lineTo(right - r, top);
    ctx.arcTo(right, top, right, top + r, r);
    ctx.lineTo(right, bottom - r);
    ctx.arcTo(right, bottom, right - r, bottom, r);
    ctx.lineTo(left + r, bottom);
    ctx.arcTo(left, bottom, left, bottom - r, r);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = this.shielded.color;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.stroke();
    ctx.stroke();
    ctx.restore();
  };

  return Shield;
})();
