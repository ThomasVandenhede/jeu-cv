// Factory pattern
var PlayerFactory = (function() {
  function Player(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
  }

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, 100, 100, Math.PI*2);
  };

  return Player;
}());