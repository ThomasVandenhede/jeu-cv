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
    this.isCrouching = false;
    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    }; // collision direction for movement
    this.collidableWith = []; // potential object collisions
    this.collidesWith = []; // actual object collisions
    this.t = Date.now();
  }

  Player.prototype.crouch = function() {
    if (!this.isCrouching) {
      this.isCrouching = true;
      this.height = 10;
      this.y += 30;
    }
  };

  Player.prototype.stand = function() {
    if (this.isCrouching) {
      this.isCrouching = false;
      this.height = 40;
      this.y -= 30;
    }
  };

  Player.prototype.collideHorizontally = function(el, dx, dy) {
    // detect horizontal collisions
    if ((this.y + dy > el.y && this.y + dy < el.y + el.height) ||
        (this.y + this.height + dy > el.y && this.y + this.height + dy < el.y + el.height) ||
        (el.y > this.y + dy && el.y < this.y + this.height + dy) ||
        (el.y + el.height > this.y + dy && el.y < this.y + this.height + dy)) {
      // left collision
      if (this.x >= el.x + el.width && this.x + dx < el.x + el.width) {
        this.isColliding.right = true;
        this.x = el.x + el.width;
        console.log('collision left');
      }
      // right collision
      if (this.x + this.width <= el.x && this.x + this.width + dx > el.x) {
        this.isColliding.left = true;
        this.x = el.x - this.width;
        console.log('collision right');
      }
    }
  }

  Player.prototype.collideVertically = function(el, dx, dy) {
    // detect vertical collisioright
    if ((this.x + dx > el.x && this.x + dx < el.x + el.width) ||
        (this.x + this.width + dx > el.x && this.x + this.width + dx < el.x + el.width) ||
        (el.x > this.x + dx && el.x < this.x + this.width + dx) ||
        (el.x + el.width > this.x + dx && el.x < this.x + this.width + dx)) {
      // up collision
      if (this.y >= el.y + el.height && this.y + dy < el.y + el.height) {
        this.isColliding.up = true;
        this.y = el.y + el.height;
        console.log('collision up');
      }
      // down collision
      if (this.y + this.height <= el.y && this.y + this.height + dy > el.y) {
        this.isColliding.down = true;
        this.y = el.y - this.height;
        console.log('collision right');
      }
    }
  }

  Player.prototype.jump = function() {
    if (this.isColliding.down) {
      this.isColliding.down = false;
      this.speed.y = -60;
    }
  };

  Player.prototype.update = function() {
    var t0 = this.t
      , t1 = Date.now()
      , v1 = new Vector()
      , x1, y1, dx, dy, dvx, dvy;

    // apply gravity based on whether player is free falling
    this.acceleration.y = 12;

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

    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    }

    // detect collision with other collidable elements
    for (let i = 0; i < this.collidableWith.length; i++) {
      this.collideHorizontally(this.collidableWith[i], dx, dy);
      this.collideVertically(this.collidableWith[i], dx, dy);
    }

    // apply natural position increments if no collision detected
    if (!this.isColliding.down && !this.isColliding.up) {
      this.y += dy;
    }

    if (!this.isColliding.right && !this.isColliding.left) {
      this.x += dx;
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