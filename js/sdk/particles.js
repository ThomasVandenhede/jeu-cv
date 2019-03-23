var sparksParticles = function(gameObj) {
  var start = Date.now();

  return {
    particleIndex: 0,
    particles: {},
    minSpeed: 5,
    maxSpeed: 20,
    size: 10,
    maxLife: 1000,
    duration: 250,
    addNewParticle: function() {
      this.particleIndex++;
      var color = !gameObj.hasWon
        ? gameObj.color
        : "rgb(" +
          randInt(0, 255) +
          ", " +
          randInt(0, 255) +
          ", " +
          randInt(0, 255) +
          ")";
      switch (randInt(0, 3)) {
        case 0:
          // top edge
          particle = new SmokeParticle({
            x: randInt(gameObj.left, gameObj.right),
            y: gameObj.top - this.size,
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, this.maxSpeed),
            vy: randInt(-this.maxSpeed, -this.minSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 1:
          // bottom edge
          particle = new SmokeParticle({
            x: randInt(gameObj.left, gameObj.right),
            y: gameObj.bottom,
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, this.maxSpeed),
            vy: randInt(this.minSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 2:
          // left edge
          particle = new SmokeParticle({
            x: gameObj.left - this.size,
            y: randInt(gameObj.top, gameObj.bottom),
            size: this.size,
            color: color,
            vx: randInt(-this.maxSpeed, -this.minSpeed),
            vy: randInt(-this.maxSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 3:
          // right edge
          particle = new SmokeParticle({
            x: gameObj.right,
            y: randInt(gameObj.top, gameObj.bottom),
            size: this.size,
            color: color,
            vx: randInt(this.minSpeed, this.maxSpeed),
            vy: randInt(-this.maxSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
      }
    },
    update: function() {
      // only add particles for a certain duration
      if (Date.now() <= start + this.duration) {
        for (var i = 0; i < 2; i++) {
          this.addNewParticle();
        }
      }

      for (var id in this.particles) {
        var particle = this.particles[id];
        particle.update();
        if (Date.now() - particle.createdAt >= this.maxLife) {
          delete this.particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in this.particles) {
        var particle = this.particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};

var explosionParticles = function(gameObj) {
  var size = 5;
  var minLife = 500;
  var maxLife = 1500;
  var particles = [];
  var minSpeed = 10;
  var maxSpeed = 50;
  var particleIndex = 0;
  for (var i = gameObj.left; i < gameObj.right; i += size) {
    for (var j = gameObj.top; j < gameObj.bottom; j += size) {
      var center = gameObj.center;
      var v = new Vector(
        randInt(-maxSpeed * 5, maxSpeed * 5),
        randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: randInt(minLife, maxLife)
      });
      particles[particleIndex] = particle;
      particleIndex++;
      var v = new Vector(
        randInt(-maxSpeed * 5, maxSpeed * 5),
        randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: randInt(minLife, maxLife)
      });
      particles[particleIndex] = particle;
      particleIndex++;
    }
  }
  return {
    update: function() {
      for (var id in particles) {
        var particle = particles[id];
        particle.v.y += (gameObj.GRAVITY_ACCELERATION / 4) * dt;
        particle.update();
        if (Date.now() - particle.createdAt >= particle.maxLife) {
          delete particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in particles) {
        var particle = particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};

var hitParticles = function(x, y, direction, color) {
  var createdAt = Date.now();
  var particleIndex = 0;
  var maxCount = 10;
  var size = 4;
  var minLife = 300;
  var maxLife = 500;
  var minSpeed = 10;
  var maxSpeed = 200;
  var particles = {};
  for (var i = 0; i < maxCount; i++) {
    var v = direction
      .getUnitVector()
      .multiplyByScalar(randInt(minSpeed, maxSpeed))
      .rotateRadians((Math.random() * Math.PI) / 3 - Math.PI / 6);
    var particle = new Particle({
      x: x,
      y: y,
      size: size,
      color: color,
      vx: v.x,
      vy: v.y,
      maxLife: randInt(minLife, maxLife)
    });
    particleIndex++;
    particles[particleIndex] = particle;
  }
  return {
    createdAt: createdAt,
    particleIndex: particleIndex,
    maxCount: maxCount,
    size: size,
    minLife: minLife,
    maxLife: maxLife,
    minSpeed: minSpeed,
    maxSpeed: maxSpeed,
    particles: particles,
    update: function() {
      for (var id in particles) {
        var particle = particles[id];
        particle.update();
        if (Date.now() - particle.createdAt >= particle.maxLife) {
          delete particles[id];
        }
      }
    },
    draw: function(ctx, camera) {
      ctx.save();
      for (var id in particles) {
        var particle = particles[id];
        particle.draw(ctx, camera);
      }
      ctx.restore();
    }
  };
};
