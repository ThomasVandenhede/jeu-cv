class Ghost {
  constructor() {}

  init(props) {
    this.timer = props.timer;
    this.player = props.player;
    this.reset();
  }

  reset() {
    this.ghostIndex = 0;
    this.ghostPositions =
      Array.isArray(this.ghostPositionsTemp) &&
      this.ghostPositionsTemp.length !== 0
        ? this.ghostPositionsTemp.slice(0)
        : [];
    this.ghostPositionsTemp = [];
  }

  update() {
    // var totalTime = this.timer.totalTime;
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
      time: this.timer.totalTime,
      x: this.player.x,
      y: this.player.y
    });
  }

  draw(ctx, camera) {
    if (this.ghost) {
      var applyCamToArr = function() {
        return Object.values(camera.apply.apply(camera, arguments));
      };
      ctx.save();
      ctx.fillStyle = "rgba(180, 180, 180, 0.7)";
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(this.ghost.x, this.ghost.y).concat([
          this.player.width * camera.zoomLevel,
          this.player.height * camera.zoomLevel
        ])
      );
      if (!this.ghostPositions[this.ghostIndex + 1]) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo.apply(ctx, applyCamToArr(this.ghost.x, this.ghost.y));
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(
            this.ghost.x + this.player.width,
            this.ghost.y + this.player.height
          )
        );
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(this.ghost.x + this.player.width, this.ghost.y)
        );
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(this.ghost.x, this.ghost.y + this.player.height)
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
