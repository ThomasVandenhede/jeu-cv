// Factory pattern
var playerFactory = (function() {
  var MAX_SPEED = 1500;
  var JUMP_SPEED = -600;
  var COEFFICIENT_OF_RESTITUTION = 0.4;
  var animationID;
  var INITIAL_SIZE = 40;

  function Player(x, y) {
    Rectangle.call(this, x, y, INITIAL_SIZE, INITIAL_SIZE);

    this.v = new Vector(0, 0);
    this.acceleration = new Vector();
    this.color = "#22dd00";
    this.color = "red";
    this.isCrouching = false;
    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    }; // collision direction for movement
    this.collidableWith = []; // potential object collisions
    this.collidesWith = []; // actual object collisions

    // sounds
    this.sounds = {
      jump: new Sound("./assets/sounds/Light swing 1.mp4"),
      hit: new Sound("./assets/sounds/Hit 1.mp4", 0.1),
      still: new Sound("./assets/sounds/Medium hum.mp4")
    };
  }

  Player.prototype = Object.create(Rectangle.prototype);

  Player.prototype.moveLeft = function() {
    this.v.x = -200;
  };

  Player.prototype.moveRight = function() {
    this.v.x = 200;
  };

  Player.prototype.crouch = function() {
    if (!this.isCrouching) {
      var dx = -1,
        deltaWidth = 2;
      this.isCrouching = true;
      animationID && clearInterval(animationID);
      animationID = setInterval(
        function() {
          this.height -= 4;
          this.y += 4;
          for (var i = 0; i < this.collidableWith.length; i++) {
            var el = this.collidableWith[i];
            if (this.top < el.bottom && this.bottom > el.top) {
              // left collision
              if (
                this.left >= el.right &&
                this.left - dx - deltaWidth < el.right
              ) {
                this.x += deltaWidth; // snap
              }
              // right collision
              if (this.right <= el.x && this.right + dx + deltaWidth > el.x) {
                this.x -= deltaWidth; // snap
              }
            }
          }
          this.x += dx;
          this.width += deltaWidth;
          if (this.height <= INITIAL_SIZE / 4) {
            clearInterval(animationID);
          }
        }.bind(this),
        20
      );
    }
  };

  Player.prototype.stand = function() {
    if (this.isCrouching) {
      var dx = this.v.x * dt;
      var targetY = this.y - (INITIAL_SIZE - this.height);
      // determine if player has enough room to stand
      for (var i = 0; i < this.collidableWith.length; i++) {
        var el = this.collidableWith[i];
        if (
          this.left + dx < el.right &&
          this.right + dx > el.left &&
          this.top >= el.bottom &&
          targetY < el.bottom
        ) {
          return;
        }
      }

      // stand
      this.isCrouching = false;
      animationID && clearInterval(animationID);
      animationID = setInterval(
        function() {
          this.height += 4;
          this.y -= 4;
          this.x += 1;
          this.width -= 2;
          if (this.height >= INITIAL_SIZE) {
            clearInterval(animationID);
          }
        }.bind(this),
        20
      );
    }
  };

  Player.prototype.collideHorizontally = function(el) {
    var collision = false;
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;
    // detect horizontal collisions
    if (this.top + dy < el.bottom && this.bottom + dy > el.top) {
      // left collision
      if (this.left >= el.right && this.left + dx < el.right) {
        this.isColliding.left = true;
        // resolve collision
        this.x = el.right; // snap
        this.v.x = 0;
        collision = true;
      }
      // right collision
      if (this.right <= el.x && this.right + dx > el.x) {
        this.isColliding.right = true;
        // resolve collision
        this.x = el.x - this.width; // snap
        this.v.x = 0;
        console.log(this.v);
        collision = true;
      }
    }
    return collision;
  };

  Player.prototype.collideVertically = function(el) {
    var collision = false;
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;
    // detect vertical collisioright
    if (this.left + dx < el.right && this.right + dx > el.left) {
      // up collision
      if (this.top >= el.bottom && this.top + dy < el.bottom) {
        this.isColliding.up = true;
        // resolve collision
        this.y = el.y + el.height; // snap
        // this.v.y = 0; // REMOVE FOR "GLUE" EFFECT WHEN COLLIDING UPWARDS
        // this.v.y = -this.v.y * COEFFICIENT_OF_RESTITUTION;
        collision = true;
      }
      // down collision
      if (this.bottom <= el.top && this.bottom + dy > el.top) {
        this.isColliding.down = true;
        // resolve collision
        this.v.y = -this.v.y * COEFFICIENT_OF_RESTITUTION;
        if (
          this.isCrouching ||
          Math.abs(this.v.y) <= GRAVITY_ACCELERATION * dt + 1
        ) {
          this.v.y = 0;
          this.y = el.y - this.height; // snap
        }
        collision = true;
      }
    }
    return collision;
  };

  Player.prototype.jump = function() {
    if (this.isColliding.down) {
      this.sounds.jump.replay();
      this.isColliding.down = false;
      this.v.y = JUMP_SPEED;
    }
  };

  Player.prototype.applyGravity = function() {
    // apply gravity if player is free falling
    this.acceleration.y = GRAVITY_ACCELERATION;

    // compute new speed based on acceleration and time ellapsed since last rendering
    this.v.y += this.acceleration.y * dt;
    this.v.y =
      Math.abs(this.v.y) > MAX_SPEED
        ? this.v.y / Math.abs(this.v.y) * MAX_SPEED
        : this.v.y;
  };

  Player.prototype.detectCollisions = function() {
    // reset collisions
    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    };

    // detect collision with other collidable elements
    for (let i = 0; i < this.collidableWith.length; i++) {
      var hasVerticalCollision, hasHorizontalCollision;
      hasHorizontalCollision = this.collideHorizontally(this.collidableWith[i]);
      hasVerticalCollision = this.collideVertically(this.collidableWith[i]);

      if (hasVerticalCollision && this.v.y) {
        this.sounds.hit.play();
      }

      this.collidableWith[i].touched =
        hasVerticalCollision || hasHorizontalCollision;
    }
  };

  Player.prototype.update = function(dt) {
    var dx, dy;

    // compute new position based on speed and time ellapsed since last rendering
    dx = this.v.x * dt;
    dy = this.v.y * dt;

    // apply natural position increments if no collision detected
    if (!this.isColliding.down && !this.isColliding.up) {
      this.y += dy;
    }

    if (!this.isColliding.right && !this.isColliding.left) {
      this.x += dx;
    }
  };

  Player.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 30;
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    ctx.restore();
  };

  return function(x, y) {
    return new Player(x, y);
  };
})();
