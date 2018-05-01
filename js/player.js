// Factory pattern
var playerFactory = (function() {
  var MAX_SPEED = 100;
  var animationID;

  function Player(x, y) {
    Rectangle.call(this, x, y, 40, 40); // subclassing Rectangle class
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

  Player.prototype = Object.create(Rectangle.prototype);

  Player.prototype.crouch = function() {
    if (!this.isCrouching) {
      this.isCrouching = true;
      animationID && clearInterval(animationID);
      animationID = setInterval(function() {
        this.height -= 2;
        this.y += 2;
        if (this.height <= 10) {
          clearInterval(animationID);
        }
      }.bind(this), 10);
    }
  };

  Player.prototype.stand = function() {
    if (this.isCrouching) {
      this.isCrouching = false;
      animationID && clearInterval(animationID);
      animationID = setInterval(() => {
        this.height += 2;
        this.y -= 2;
        if (this.height >= 40) {
          clearInterval(animationID);
        }
      }, 10);
    }
  };

  Player.prototype.collideHorizontally = function(el, dx, dy) {
    var playerLeft = this.x;
    var playerTop = this.y;
    var playerRight = this.x + this.width;
    var playerBottom = this.y + this.height;
    var elLeft = el.x;
    var elTop = el.y;
    var elRight = el.x + el.width;
    var elBottom = el.y + el.height;

    // detect horizontal collisions
    if (playerTop < elBottom && playerBottom > elTop) {
      // left collision
      if (playerLeft >= elRight && playerLeft + dx < elRight) {
        this.isColliding.right = true;
        this.x = elRight;
      }
      // right collision
      if (playerRight <= el.x && playerRight + dx > el.x) {
        this.isColliding.left = true;
        this.x = el.x - this.width;
      }
    }
  };

  Player.prototype.collideVertically = function(el, dx, dy) {
    var playerLeft = this.x;
    var playerTop = this.y;
    var playerRight = this.x + this.width;
    var playerBottom = this.y + this.height;
    var elLeft = el.x;
    var elTop = el.y;
    var elRight = el.x + el.width;
    var elBottom = el.y + el.height;

    // detect vertical collisioright
    if (playerLeft < elRight && playerRight > elLeft) {
      // up collision
      if (playerTop >= elBottom && playerTop + dy < elBottom) {
        this.isColliding.up = true;
        this.y = el.y + el.height;
      }
      // down collision
      if (playerBottom <= elTop && playerBottom + dy > elTop) {
        this.isColliding.down = true;
        this.y = el.y - this.height;
      }
    }
  };

  Player.prototype.jump = function() {
    if (this.isColliding.down) {
      this.isColliding.down = false;
      this.speed.y = -60;
    }
  };

  Player.prototype.update = function() {
    var t0 = this.t,
      t1 = Date.now(),
      v1 = new Vector(),
      x1,
      y1,
      dx,
      dy,
      dvx,
      dvy;

    // apply gravity based on whether player is free falling
    this.acceleration.y = 12;

    // compute new speed based on acceleration and time ellapsed since last rendering
    dvx = this.acceleration.x * (t1 - t0) / 100;
    this.speed.x =
      this.speed.x + dvx > MAX_SPEED ? MAX_SPEED : this.speed.x + dvx;
    if (this.isColliding.down) {
      this.speed.y = 0;
    } else {
      dvy = this.acceleration.y * (t1 - t0) / 100;
      this.speed.y =
        this.speed.y + dvy > MAX_SPEED ? MAX_SPEED : this.speed.y + dvy;
    }

    // compute new position based on speed and time ellapsed since last rendering
    dx = (t1 - t0) / 100 * this.speed.x;
    dy = (t1 - t0) / 100 * this.speed.y;

    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    };

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

    // Number.prototype.mod = function(n) {
    //   return (this % n + n) % n;
    // };

    // this.y = this.y.mod(canvas.height);
    // this.x = this.x.mod(canvas.width);

    this.t = t1;
  };

  Player.prototype.draw = function(ctx, camera) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
  };

  return function(x, y) {
    return new Player(x, y);
  };
})();
