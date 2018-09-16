class Tile {
  constructor(x, y, size, src) {
    // this.row = row;
    // this.column = column;
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = new Image();
    this.image.src = src;
  }

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    ctx.save();
    ctx.drawImage.apply(
      ctx,
      [this.image]
        .concat(applyCamToArr(this.x, this.y))
        .concat([this.size * camera.zoomLevel, this.size * camera.zoomLevel])
    );
    ctx.restore();
  }
}
