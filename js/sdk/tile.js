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
    ctx.save();
    ctx.drawImage(
      this.image,
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.size),
      camera.applyToDistance(this.size)
    );
    ctx.restore();
  }
}
