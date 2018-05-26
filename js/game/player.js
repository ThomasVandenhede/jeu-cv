var Player = (function() {
  var MAX_SPEED = 1500;
  var JUMP_SPEED = -600;
  var COEFFICIENT_OF_RESTITUTION = 0.4;
  var animationID;
  var INITIAL_WIDTH = 5;
  var INITIAL_HEIGHT = 70;

  function Player(x, y) {
    AABB.call(this, x, y, INITIAL_WIDTH, INITIAL_HEIGHT);

    var that = this;
    this.v = new Vector(0, 0);
    this.acceleration = new Vector();
    this.color = "#22dd00";
    this.color = "#37e018";

    this.particlesManager = {
      particleIndex: 0,
      maxCount: 50,
      particles: {},
      color: that.color,
      size: 2,
      maxLife: 500,
      addNewParticles: function() {
        if (Object.keys(this.particles).length < this.maxCount) {
          this.particleIndex++;
          var position;
          switch (randInt(0, 3)) {
            case 0:
              position = {
                x: randInt(that.left, that.right),
                y: that.top,
                vx: randInt(-20, 20),
                vy: randInt(-20, -5)
              };
              break;
            case 1:
              position = {
                x: randInt(that.left, that.right),
                y: that.bottom,
                vx: randInt(-20, 20),
                vy: randInt(5, 20)
              };
              break;
            case 2:
              position = {
                x: that.left,
                y: randInt(that.top, that.bottom),
                vx: randInt(-20, -5),
                vy: randInt(-20, 20)
              };
              break;
            case 3:
              position = {
                x: that.right,
                y: randInt(that.top, that.bottom),
                vx: randInt(5, 20),
                vy: randInt(-20, 20)
              };
              break;
          }
          [];
          var color = this.color;
          // var color =
          //   "rgb(" +
          //   randInt(0, 255) +
          //   ", " +
          //   randInt(0, 255) +
          //   ", " +
          //   randInt(0, 255) +
          //   ")";
          var particle = new Particle(
            position.x,
            position.y,
            this.size,
            color,
            position.vx,
            position.vy
          );
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
        }
      },
      update: function() {
        this.addNewParticles();
        for (var id in this.particles) {
          var particle = this.particles[id];
          particle.update();
          if (Date.now() - particle.createdAt > this.maxLife) {
            delete this.particles[id];
          }
        }
      },
      draw: function(ctx, camera) {
        for (var id in this.particles) {
          var particle = this.particles[id];
          particle.draw(ctx, camera);
        }
      }
    };

    // crouching / standing state and animations
    this.isCrouching = false;
    this.crouchStandAnimationDuration = 0.2;

    // collision direction for movement
    this.isColliding = {
      right: false,
      left: false,
      up: false,
      down: false
    };
    this.collidableWith = []; // potential object collisions
    this.collidesWith = []; // actual object collisions

    // sounds
    this.sounds = {
      jump: [
        new Sound("./assets/sounds/Light swing 1.mp4", 1),
        new Sound("./assets/sounds/Light swing 2.mp4", 1)
      ],
      hit: [
        new Sound("./assets/sounds/Hit 1.mp4", 0.2),
        new Sound("./assets/sounds/Hit 2.mp4", 0.2)
      ],
      still: new Sound("./assets/sounds/Medium hum.mp4", 0.15)
    };

    // shield
    this.shield = new Shield(this);

    // does the player get stuck to the ceiling when jumping?
    this.stickyJump = false;
  }

  Player.prototype = Object.create(AABB.prototype);

  Player.prototype.moveLeft = function() {
    this.v.x = -200;
  };

  Player.prototype.moveRight = function() {
    this.v.x = 200;
  };

  Player.prototype.crouch = function() {
    this.isCrouching = true;
  };

  Player.prototype.stand = function() {
    this.isCrouching = false;
  };

  Player.prototype.jump = function() {
    if (this.isColliding.down) {
      this.isCrouching
        ? this.sounds.jump[1].replay()
        : this.sounds.jump[0].replay();
      this.isColliding.down = false;
      this.v.y = JUMP_SPEED;
    }
    this.sounds.still.play(); // REMOVE THIS FROM HERE
  };

  Player.prototype.collideHorizontally = function(el) {
    var collision = false;
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;

    var deltaWidth = this.getDeltaWidth();

    // detect horizontal collisions
    if (this.top + dy < el.bottom && this.bottom + dy > el.top) {
      // left collision
      if (this.left >= el.right && this.left + dx - deltaWidth < el.right) {
        this.isColliding.left = true;
        // resolve collision
        this.x = el.right + deltaWidth + 1; // snap
        this.v.x = 0;
        collision = true;
      }
      // right collision
      if (this.right <= el.x && this.right + dx + deltaWidth > el.x) {
        this.isColliding.right = true;
        // resolve collision
        this.x = el.x - this.width - deltaWidth - 1; // snap
        this.v.x = 0;
        collision = true;
      }
    }
    return collision;
  };

  Player.prototype.collideVertically = function(el) {
    var collision = false;
    var dx = this.v.x * dt;
    var dy = this.v.y * dt;

    // detect vertical collision right
    if (this.left + dx < el.right && this.right + dx > el.left) {
      // up collision
      if (this.top >= el.bottom && this.top + dy < el.bottom) {
        this.isColliding.up = true;
        this.y = el.y + el.height; // snap
        // this.v.y = el.y; // REMOVE FOR "GLUE" EFFECT WHEN COLLIDING UPWARDS
        // this.v.y = -this.v.y * COEFFICIENT_OF_RESTITUTION;
        collision = true;
      }
      // down collision
      if (this.bottom <= el.top && this.bottom + dy > el.top) {
        this.isColliding.down = true;
        this.v.y = -this.v.y * COEFFICIENT_OF_RESTITUTION;
        this.v.x += el.v.x;
        if (
          this.isCrouching ||
          Math.abs(this.v.y) <= gameData.constants.GRAVITY_ACCELERATION * dt + 1
        ) {
          this.v.y = 0;
          this.y = el.y - this.height; // snap
        }
        collision = true;
      }
    }
    return collision;
  };

  Player.prototype.applyGravity = function() {
    // apply gravity if player is free falling
    this.acceleration.y = gameData.constants.GRAVITY_ACCELERATION;

    // compute new speed based on acceleration and time ellapsed since last rendering
    this.v.y += this.acceleration.y * dt;
    this.v.y =
      Math.abs(this.v.y) > MAX_SPEED
        ? Math.sign(this.v.y) * MAX_SPEED
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
    for (var i = 0; i < this.collidableWith.length; i++) {
      var hasVerticalCollision = false,
        hasHorizontalCollision = false;
      var rect = this.collidableWith[i];
      // // TEST
      // hasVerticalCollision = this.overlaps(this.collidableWith[i]);
      // hasVerticalCollision && console.log(this.collidableWith[i]);
      // if (hasVerticalCollision) {
      //   this.v.y = 0;
      // }

      hasHorizontalCollision = this.collideHorizontally(rect);
      hasVerticalCollision = this.collideVertically(rect);

      if (hasVerticalCollision && this.v.y) {
        this.sounds.hit[Math.floor(Math.random() * 2)].replay();
      }

      rect.touched = hasVerticalCollision || hasHorizontalCollision;
    }
  };

  Player.prototype.getDeltaWidth = function() {
    var deltaWidth;
    var computedDelta =
      dt / this.crouchStandAnimationDuration * (INITIAL_HEIGHT - INITIAL_WIDTH); // absolute value
    if (this.isCrouching) {
      deltaWidth =
        this.height - computedDelta < INITIAL_WIDTH
          ? this.height - INITIAL_WIDTH
          : computedDelta;
    } else {
      deltaWidth =
        this.height + computedDelta > INITIAL_HEIGHT
          ? this.height - INITIAL_HEIGHT
          : -computedDelta;
    }
    return deltaWidth;
  };

  Player.prototype.updatePlayerSize = function(deltaWidth) {
    this.width = toFixedPrecision(this.width + deltaWidth, 3);
    this.height = toFixedPrecision(this.height - deltaWidth, 3);
    this.x = toFixedPrecision(this.x - deltaWidth / 2, 3);
    this.y = toFixedPrecision(this.y + deltaWidth, 3);
  };

  Player.prototype.getNextState = function() {
    // apply gravity if player is free falling
    var ay = this.GRAVITY_ACCELERATION;

    // compute new speed based on acceleration and time ellapsed
    var vy = this.v.y + ay * dt;
    vy = Math.abs(vy) > MAX_FALL_SPEED ? Math.sign(vy) * MAX_FALL_SPEED : vy;
    return new AABB(
      this.x + this.v.x * dt,
      this.y + vy * dt,
      this.width,
      this.height
    );
  };

  Player.prototype.update = function() {
    var dx = this.v.x * dt,
      dy = this.v.y * dt;

    this.updatePlayerSize(this.getDeltaWidth());
    // apply natural position increments if no collision detected
    if (!this.isColliding.down && !this.isColliding.up) {
      this.y = toFixedPrecision(this.y + dy, 2);
    }

    if (!this.isColliding.right && !this.isColliding.left) {
      this.x = toFixedPrecision(this.x + dx, 2);
    }

    this.particlesManager.update();
  };

  Player.prototype.draw = function(ctx, camera) {
    var r = 2.5;
    var left = this.x - camera.x;
    var top = this.y - camera.y;
    var right = left + this.width;
    var bottom = top + this.height;
    var color = this.color;

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(left, top + r);
    ctx.arcTo(left, top, left + r, top, r);
    ctx.lineTo(right - r, top);
    ctx.arcTo(right, top, right, top + r, r);
    ctx.lineTo(right, bottom - r);
    ctx.arcTo(right, bottom, right - r, bottom, r);
    ctx.lineTo(left + r, bottom);
    ctx.arcTo(left, bottom, left, bottom - r, r);
    ctx.closePath();
    ctx.fill();
    ctx.fill();
    ctx.fill();
    ctx.fill();
    ctx.shadowBlur = 60;
    ctx.fill();
    ctx.fill();
    ctx.fill();
    ctx.restore();

    // draw player shield
    (this.shield.isOpen || this.shield.isAnimating) &&
      this.shield.draw(ctx, camera);

    this.particlesManager.draw(ctx, camera);
  };

  return Player;
})();
