var Player = (function() {
  var ABS_JUMP_SPEED = 600;
  var MAX_FALL_SPEED = 1000;
  var animationID;
  var INITIAL_WIDTH = 40;
  var INITIAL_HEIGHT = 40;
  var CROUCH_STAND_ANIMATION_DURATION = 0.2;

  function Player(x, y) {
    AABB.call(this, x, y, INITIAL_WIDTH, INITIAL_HEIGHT);

    var that = this;
    this.v = new Vector(0, 0);
    this.acceleration = new Vector();
    this.COEFFICIENT_OF_RESTITUTION = 0.4;
    this.solid = true; // can collide with other solid objects
    this.color = "#22dd00";
    this.color = "#37e018";

    this.sparks = sparksParticles(this);

    // crouching / standing state and animations
    this.isCrouching = false;
    CROUCH_STAND_ANIMATION_DURATION = 0.2;

    // collision direction for movement
    this.isColliding = [0, 0]; // [horizontal, vertical]
    this.collidableWith = []; // potential object collisions
    this.collidingWith = [null, null]; // actual object collisions
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

  Player.prototype.die = function() {
    this.isDead = true;
    this.explosion = explosionParticles(this);
  };

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

  Player.prototype.update = function() {
    !this.isDead ? this.sparks.update() : this.explosion.update();
    if (this.isDead) return;

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
  };

  Player.prototype.draw = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.applyCamera.apply(camera, arguments));
    };

    if (!this.isDead) {
      var r = 5;
      var left = this.x;
      var top = this.y;
      var right = left + this.width;
      var bottom = top + this.height;
      var color = this.color;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(left, top + r));
      ctx.arcTo.apply(
        ctx,
        applyCamToArr(left, top)
          .concat(applyCamToArr(left + r, top))
          .concat([r * camera.zoomLevel])
      );
      ctx.lineTo.apply(ctx, applyCamToArr(right - r, top));
      ctx.arcTo.apply(
        ctx,
        applyCamToArr(right, top)
          .concat(applyCamToArr(right, top + r))
          .concat([r * camera.zoomLevel])
      );
      ctx.lineTo.apply(ctx, applyCamToArr(right, bottom - r));
      ctx.arcTo.apply(
        ctx,
        applyCamToArr(right, bottom)
          .concat(applyCamToArr(right - r, bottom))
          .concat([r * camera.zoomLevel])
      );
      ctx.lineTo.apply(ctx, applyCamToArr(left + r, bottom));
      ctx.arcTo.apply(
        ctx,
        applyCamToArr(left, bottom)
          .concat(applyCamToArr(left, bottom - r))
          .concat([r * camera.zoomLevel])
      );
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      // draw player shield
      (this.shield.isOpen || this.shield.isAnimating) &&
        this.shield.draw(ctx, camera);
    }

    !this.isDead
      ? this.sparks.draw(ctx, camera)
      : this.explosion.draw(ctx, camera);
  };

  return Player;
})();
