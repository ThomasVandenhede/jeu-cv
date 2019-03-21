function Ghost() {}

Ghost.prototype.init = function(props) {
  this.clock = props.clock;
  this.player = props.player;
  this.reset();
};

Ghost.prototype.reset = function() {
  this.ghostIndex = 0;
  this.ghostPositions =
    Array.isArray(this.ghostPositionsTemp) &&
    this.ghostPositionsTemp.length !== 0
      ? this.ghostPositionsTemp.slice(0)
      : [];
  this.ghostPositionsTemp = [];
};

Ghost.prototype.update = function() {
  // var totalTime = this.clock.totalTime;
  // var ghostTimes = this.ghostPositions.map(function(position) {
  //   return position.time;
  // });
  // var currentGhostTime = ghostTimes.find(function(time, index) {
  //   return totalTime >= time && totalTime < ghostTimes[index + 1];
  // });
  // var ghostIndex = ghostTimes.indexOf(currentGhostTime);
  // var nextGhostTime = ghostTimes[ghostIndex + 1];

  // var timeRatio =
  //   (totalTime - currentGhostTime) / (nextGhostTime - currentGhostTime);

  // if (this.ghostPositions.length) {
  //   this.ghost = {};
  //   this.ghost.x =
  //     this.ghostPositions[ghostIndex].x +
  //     (this.ghostPositions[ghostIndex + 1].x -
  //       this.ghostPositions[ghostIndex].x) *
  //       timeRatio;
  //   this.ghost.y =
  //     this.ghostPositions[ghostIndex].y +
  //     (this.ghostPositions[ghostIndex + 1].y -
  //       this.ghostPositions[ghostIndex].y) *
  //       timeRatio;
  // } else {
  //   this.ghost = null;
  // }
  this.ghost = this.ghostPositions.length
    ? this.ghostPositions[this.ghostIndex]
    : null;
  this.ghostPositions[this.ghostIndex + 1] && this.ghostIndex++;

  // store position for next ghost
  this.ghostPositionsTemp.push({
    time: this.clock.totalTime,
    x: this.player.x,
    y: this.player.y
  });
};

Ghost.prototype.draw = function(ctx, camera) {
  if (this.ghost) {
    ctx.save();
    ctx.fillStyle = "rgba(180, 180, 180, 0.7)";
    ctx.fillRect(
      camera.applyToX(this.ghost.x),
      camera.applyToY(this.ghost.y),
      camera.applyToDistance(this.player.width),
      camera.applyToDistance(this.player.height)
    );
    if (!this.ghostPositions[this.ghostIndex + 1]) {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(camera.applyToX(this.ghost.x), camera.applyToY(this.ghost.y));
      ctx.lineTo(
        camera.applyToX(this.ghost.x + this.player.width),
        camera.applyToY(this.ghost.y + this.player.height)
      );
      ctx.moveTo(
        camera.applyToX(this.ghost.x + this.player.width),
        camera.applyToY(this.ghost.y)
      );
      ctx.lineTo(
        camera.applyToX(this.ghost.x),
        camera.applyToY(this.ghost.y + this.player.height)
      );
      ctx.stroke();
    }
    ctx.restore();
  }
};
