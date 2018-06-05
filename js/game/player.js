var Player = (function() {
  var ABS_JUMP_SPEED = 700;
  var MAX_FALL_SPEED = 1000;
  var animationID;
  var INITIAL_WIDTH = 30;
  var INITIAL_HEIGHT = 30;
  var CROUCH_STAND_ANIMATION_DURATION = 0.2;

  function Player(options) {
    AABB.call(this, options.x, options.y, INITIAL_WIDTH, INITIAL_HEIGHT);

    var that = this;
    this.v = new Vector(0, 0);
    this.acceleration = new Vector();
    this.COEFFICIENT_OF_RESTITUTION = 0.4;
    this.solid = true; // can collide with other solid objects
    this.maxHitPoints = 100;
    this.hitPoints = this.maxHitPoints;
    this.skills = []; // the player must harvest these
    // this.color = "#22dd00";
    // this.color = "#37e018";
    this.color = this.getColorFromHP();

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
        // new Sound("./assets/sounds/Swoosh1.mp3", 0.25),
        new Sound("./assets/sounds/Swoosh2.mp3", 0.1),
        new Sound("./assets/sounds/Swoosh3.mp3", 0.3)
      ],
      hit: [
        new Sound("./assets/sounds/Hit 1.mp4", 0.2),
        new Sound("./assets/sounds/Hit 2.mp4", 0.2)
      ],
      still: new Sound("./assets/sounds/Medium hum.mp4", 0.15),
      die: new Sound("./assets/sounds/impactsplat03.mp3", 0.8),
      hurt: new Sound("./assets/sounds/Knife Stab.mp3", 0.2)
    };

    // should the player get stuck to the ceiling when jumping?
    this.stickyJump = false;

    // player's own gravity
    this.GRAVITY_ACCELERATION = gameData.constants.GRAVITY_ACCELERATION;
  }

  Player.prototype = Object.create(AABB.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.moveLeft = function() {
    this.v.x = -250;
  };

  Player.prototype.moveRight = function() {
    this.v.x = 250;
  };

  Player.prototype.crouch = function() {
    this.isCrouching = true;
  };

  Player.prototype.stand = function() {
    this.isCrouching = false;
  };

  Player.prototype.jump = function() {
    if (this.isColliding[1] === Math.sign(this.GRAVITY_ACCELERATION)) {
      this.sounds.jump[randInt(0, this.sounds.jump.length - 1)].replay();
      this.isColliding[1] = 0;
      this.v.y = -Math.sign(this.GRAVITY_ACCELERATION) * ABS_JUMP_SPEED;
    }
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

  Player.prototype.applyDamage = function(damage) {
    this.sounds.hurt.replay();
    this.hitPoints = toFixedPrecision(this.hitPoints - damage);
  };

  Player.prototype.die = function() {
    this.isDead = true;
    this.hitPoints = 0;
    this.color = this.getColorFromHP();
    this.sounds.still.stop();
    this.sounds.die.play();
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
    if (this.isDead) {
      this.explosion.update();
      return;
    } else {
      this.sparks.update();
    }

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

  Player.prototype.getHitPointsRatio = function() {
    return this.hitPoints / this.maxHitPoints;
  };

  Player.prototype.getColorFromHP = function() {
    var hitPointsRatio = this.getHitPointsRatio();
    var color = "hsl(" + hitPointsRatio * 120 + ", 100%, 50%)";
    return color;
  };

  Player.prototype.draw = function(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };

    // draw particles
    this.color = this.getColorFromHP();
    !this.isDead
      ? this.sparks.draw(ctx, camera)
      : this.explosion.draw(ctx, camera);

    // draw player
    if (!this.isDead) {
      var r = 5;
      var left = this.x;
      var top = this.y;
      var right = left + this.width;
      var bottom = top + this.height;
      var center = this.center;
      var lineWidth = 5;

      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.lineWidth = lineWidth * camera.zoomLevel;
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(this.x, this.y).concat(
          this.width * camera.zoomLevel,
          this.height * camera.zoomLevel
        )
      );

      // draw mask
      ctx.fillStyle = "black";
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(this.left, this.top + 10).concat([
          this.width * camera.zoomLevel,
          10 * camera.zoomLevel
        ])
      );

      // draw eyes
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(center.x - 10, this.top + 12));
      ctx.quadraticCurveTo.apply(
        ctx,
        applyCamToArr(center.x - 4, this.top + 14).concat(
          applyCamToArr(center.x - 4, this.top + 16)
        )
      );
      ctx.quadraticCurveTo.apply(
        ctx,
        applyCamToArr(center.x - 10, this.top + 16).concat(
          applyCamToArr(center.x - 10, this.top + 14)
        )
      );
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo.apply(ctx, applyCamToArr(center.x + 10, this.top + 12));
      ctx.quadraticCurveTo.apply(
        ctx,
        applyCamToArr(center.x + 4, this.top + 14).concat(
          applyCamToArr(center.x + 4, this.top + 16)
        )
      );
      ctx.quadraticCurveTo.apply(
        ctx,
        applyCamToArr(center.x + 10, this.top + 16).concat(
          applyCamToArr(center.x + 10, this.top + 14)
        )
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // draw shield
      if (this.shield.isOpen || this.shield.isAnimating) {
        this.shield.draw(ctx, camera);
      }
    }
  };

  return Player;
})();
