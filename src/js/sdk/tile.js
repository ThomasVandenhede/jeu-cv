function Tile(x, y, size, src) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.image = new Image();
  this.image.src = src;
}

Tile.prototype.draw = function(ctx, camera) {
  ctx.save();
  ctx.drawImage(
    this.image,
    camera.applyToX(this.x),
    camera.applyToY(this.y),
    camera.applyToDistance(this.size),
    camera.applyToDistance(this.size)
  );
  ctx.restore();
};

module.exports = Tile;
