function CollisionManager(props) {
  this.level = props.level;
  this.timer = props.timer;
  this.camera = props.camera;
}

CollisionManager.prototype.handleCollisions = function() {
  this.handleCollisionsWithPlatforms();
  this.handleCollisionsWithSkills();
  this.handleCollisionsWithLasers();
};

CollisionManager.prototype.handleCollisionsWithLasers = function() {
  var playerBox = this.level.player.getBoundingRect();
  !this.level.player.shield.isOpen
    ? this.level.lasers.forEach(function(laser, index) {
        var laserBox = laser.getBoundingRect();
        if (physics.collision.AABBWithAABB(playerBox, laserBox)) {
          if (
            playerBox.contains(laser.A.x, laser.A.y) ||
            playerBox.contains(laser.B.x, laser.B.y) ||
            physics.collision.segmentAABB(laser.A, laser.B, playerBox) <
              Number.POSITIVE_INFINITY
          ) {
            this.level.player.applyDamage(laser.damage);
            this.level.player.hitPoints <= 0 && this.level.player.die();
            this.level.particles.push(
              hitParticles(
                laser.B.x,
                laser.B.y,
                Vector.subtract(laser.A, laser.B),
                "red"
              )
            );
            this.destroyLaser(index);
          }
        }
      }, this)
    : this.level.lasers.forEach(function(laser, index) {
        if (this.level.player.shield.hasCollisionWithLaser(laser)) {
          this.destroyLaser(index);
        }
      }, this);
};

CollisionManager.prototype.destroyLaser = function(index) {
  this.level.lasers.splice(index, 1);
};

// player acquires skill, no collision to resolve, skills simply disappears
CollisionManager.prototype.handleCollisionsWithSkills = function() {
  var playerBox = this.level.player.getBoundingRect();
  this.level.skills.forEach(function(skill, index) {
    var skillBox = skill.getBoundingRect();
    if (physics.collision.AABBWithAABB(playerBox, skillBox)) {
      this.level.player.skills.push(skill);
      this.timer.countdownStart += 5 * 1000; // add 5s to timer
      this.level.skills.splice(index, 1);
    }
  }, this);
};

CollisionManager.prototype.getCollidablePlatformsInViewport = function() {
  return this.level.platforms.filter(function(platform) {
    var box = platform.getBoundingRect();
    box.touched = false;
    return box.overlaps(this.camera);
  }, this);
};

CollisionManager.prototype.getCollisions = function(collidableGameObjects) {
  var player = this.level.player;
  var collisions = [];

  // loop over each collidable object and store collision data
  collidableGameObjects.forEach(function(box) {
    var md = AABB.minkowskiDifference(box, player);
    // window.md = md; // remove this when everything's working
    var relMotion = Vector.subtract(player.v, box.v).multiplyByScalar(dt);
    var colInfo = physics.collision.segmentAABB(new Vector(), relMotion, md);
    var t = colInfo.t;
    var side = colInfo.side;

    // create array of all collisions for that frame
    if (t < Number.POSITIVE_INFINITY) {
      var d = side[0] ? relMotion.x * side[0] : relMotion.y * side[1];
      // If there is a collision along one of the axes,
      // add collision to the array of collision characteristics
      d > 0 &&
        collisions.push({
          side: side,
          box: box,
          d: d
        });
    }
  });
  return collisions;
};

CollisionManager.prototype.handleCollisionsWithPlatforms = function() {
  var player = this.level.player;
  var collidableWith = this.getCollidablePlatformsInViewport();
  var collisions;
  var boxH = null,
    boxV = null;

  // apply gravity acceleration and reset collisions
  player.applyGravity();
  player.isColliding = [0, 0];
  collisions = this.getCollisions(collidableWith);

  /**
   * COLLISION RESOLUTION
   **/

  // determine FINAL COLLISION characteristics
  var dH = 0,
    dV = 0;
  collisions.forEach(function(collision) {
    var side = collision.side;
    var d = collision.d;
    var box = collision.box;

    // die if player has double sided collision
    if (
      side[0] * player.isColliding[0] < 0 ||
      side[1] * player.isColliding[1] < 0
    ) {
      player.die();
      return;
    }

    // set player collisions [0, 1] + [-1, 0] -> [-1, 1]
    if (box.solid) {
      player.isColliding[0] = side[0] ? side[0] : player.isColliding[0];
      if (box.passthrough) {
        player.isColliding[1] =
          side[1] * player.GRAVITY_ACCELERATION > 0
            ? side[1]
            : player.isColliding[1];
      } else {
        player.isColliding[1] = side[1] ? side[1] : player.isColliding[1];
      }
    }

    // if new value of d is greater than the old one then the new box is the one in contact with the player
    if (side[0]) {
      if (d > dH) {
        dH = d;
        boxH = box;
      }
    } else if (side[1]) {
      if (d > dV) {
        dV = d;
        boxV = box;
      }
    }
  });

  // resolve horizontal collision
  if (player.isColliding[0]) {
    player.x =
      player.isColliding[0] > 0
        ? toFixedPrecision(boxH.left + boxH.v.x * dt - player.width, 2) // snap
        : toFixedPrecision(boxH.right + boxH.v.x * dt, 2);
  }
  // resolve vertical collision
  if (player.isColliding[1]) {
    player.y =
      player.isColliding[1] > 0
        ? toFixedPrecision(boxV.top + boxV.v.y * dt - player.height, 2)
        : toFixedPrecision(boxV.bottom + boxV.v.y * dt, 2);
  }

  // inform the player about which objects it's colliding with
  player.collidingWith = [boxH, boxV];
  if (boxH) {
    boxH.touched = true;
  }
  if (boxV) {
    boxV.touched = true;
  }
};
