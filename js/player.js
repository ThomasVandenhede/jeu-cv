// Factory pattern
var PlayerFactory = (function() {
  function Player(x, y) {
    this.x = x;
    this.y = y;
    this.speed = new Vector();
  }

  Player.prototype.update = function() {
    this.x += this.speed.x;
    this.x += this.speed.x;
  }

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, 100, 100, Math.PI*2);
  };

  return Player;
}());