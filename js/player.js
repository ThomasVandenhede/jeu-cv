// Factory pattern
var playerFactory = (function() {
  var MAX_SPEED = 100;

  function Player(x, y) {
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 40;
    this.speed = new Vector(0, 0);
    this.acceleration = new Vector();
    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    };
    this.t = Date.now();
  }

  Player.prototype.jump = function() {
    if (this.isColliding.down) {
      this.isColliding.down = false;
      this.speed.y = -60;
    }
  }

  Player.prototype.update = function() {
    var t0 = this.t
      , t1 = Date.now()
      , v1 = new Vector()
      , x1, y1, dx, dy, dvx, dvy;

    // apply gravity based on whether player is free falling
    this.acceleration.y = (this.isColliding.down) ? 0 : 10;

    // compute new speed based on acceleration and time ellapsed since last rendering
    dvx = this.acceleration.x * (t1 - t0) / 100;
    this.speed.x = (this.speed.x + dvx > MAX_SPEED) ? MAX_SPEED : this.speed.x + dvx;
    if (this.isColliding.down) {
      this.speed.y = 0;
    } else {
      dvy = this.acceleration.y * (t1 - t0) / 100;
      this.speed.y = (this.speed.y + dvy > MAX_SPEED) ? MAX_SPEED : this.speed.y + dvy;
    }
    
    // compute new position based on speed and time ellapsed since last rendering
    dx = (t1 - t0) / 100 * this.speed.x;
    dy = (t1 - t0) / 100 * this.speed.y;
    this.x += dx;
    if (this.y + dy >= canvas.height) {
      this.y = canvas.height - this.height;
      this.isColliding.down = true;
    } else {
      this.y += dy;
    }
    
    this.t = t1;
  }

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  return function(x, y) {
    return new Player(x, y);
  }
}());