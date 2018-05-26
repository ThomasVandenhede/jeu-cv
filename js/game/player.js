var Player = (function() {
  var ABS_JUMP_SPEED = 600;
  var MAX_FALL_SPEED = 1000;
  var animationID;
  var INITIAL_WIDTH = 5;
  var INITIAL_HEIGHT = 70;
  var CROUCH_STAND_ANIMATION_DURATION = 0.2;

  function Player(x, y) {
    AABB.call(this, x, y, INITIAL_WIDTH, INITIAL_HEIGHT);

    var that = this;
    this.v = new Vector(0, 0);
    this.acceleration = new Vector();
    this.COEFFICIENT_OF_RESTITUTION = 0.4;
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
    CROUCH_STAND_ANIMATION_DURATION = 0.2;

    // collision direction for movement
    this.isColliding = {
      right: 0,
      left: 0,
      up: 0,
      down: 0
    };

    this.isColliding = [0, 0]; // [horizontal, vertical]
    this.collidableWith = []; // potential object collisions
    this.collidesWith = []; // actual object collisions
    this.shield = new Shield(this);

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

    // should the player get stuck to the ceiling when jumping?
    this.stickyJump = false;

    // player's own gravity
    this.GRAVITY_ACCELERATION = gameData.constants.GRAVITY_ACCELERATION;
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
    if (this.isColliding[1] === Math.sign(this.GRAVITY_ACCELERATION)) {
      this.isCrouching
        ? this.sounds.jump[1].replay()
        : this.sounds.jump[0].replay();
      this.isColliding[1] = 0;
      this.v.y = -Math.sign(this.GRAVITY_ACCELERATION) * ABS_JUMP_SPEED;
    }
    this.sounds.still.play();
  };

  Player.prototype.reverseGravity = function() {
    this.GRAVITY_ACCELERATION = -this.GRAVITY_ACCELERATION;
  };

  Player.prototype.zeroGravity = function() {
    if (this.GRAVITY_ACCELERATION) {
      this.GRAVITY_ACCELERATION = 0;
    } else {
      this.GRAVITY_ACCELERATION = gameData.constants.GRAVITY_ACCELERATION;
    }
  };

  Player.prototype.die = function() {};

  Player.prototype.getDeltaWidth = function() {
    var deltaWidth;
    var computedDelta =
      dt / CROUCH_STAND_ANIMATION_DURATION * (INITIAL_HEIGHT - INITIAL_WIDTH); // absolute value
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
    this.y =
      this.GRAVITY_ACCELERATION < 0
        ? toFixedPrecision(this.y, 3)
        : toFixedPrecision(this.y + deltaWidth, 3);
  };

  Player.prototype.applyGravity = function() {
    // apply gravity if player is free falling
    this.acceleration.y = this.GRAVITY_ACCELERATION;

    // compute new speed based on acceleration and time ellapsed
    this.v.y += this.acceleration.y * dt;
    this.v.y =
      Math.abs(this.v.y) > MAX_FALL_SPEED
        ? Math.sign(this.v.y) * MAX_FALL_SPEED
        : this.v.y;
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
    if (!this.isColliding[1]) {
      this.y = toFixedPrecision(this.y + dy, 2);
    }

    if (!this.isColliding[0]) {
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
    ctx.shadowBlur = 40;
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
