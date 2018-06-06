var sparksParticles = function(gameObj) {
  return {
    particleIndex: 0,
    maxCount: 30,
    particles: {},
    minSpeed: 5,
    maxSpeed: 20,
    size: 10,
    maxLife: 500,
    addNewParticle: function() {
      if (Object.keys(this.particles).length < this.maxCount) {
        this.particleIndex++;
        var particle;
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
            particle = new SmokeParticle(
              randInt(gameObj.left, gameObj.right),
              gameObj.top - this.size,
              this.size,
              color,
              randInt(-this.maxSpeed, this.maxSpeed),
              randInt(-this.maxSpeed, -this.minSpeed),
              this.maxLife
            );
            particle.id = this.particleIndex;
            this.particles[this.particleIndex] = particle;
            break;
          case 1:
            // bottom edge
            particle = new SmokeParticle(
              randInt(gameObj.left, gameObj.right),
              gameObj.bottom,
              this.size,
              color,
              randInt(-this.maxSpeed, this.maxSpeed),
              randInt(this.minSpeed, this.maxSpeed),
              this.maxLife
            );
            particle.id = this.particleIndex;
            this.particles[this.particleIndex] = particle;
            break;
          case 2:
            // left edge
            particle = new SmokeParticle(
              gameObj.left - this.size,
              randInt(gameObj.top, gameObj.bottom),
              this.size,
              color,
              randInt(-this.maxSpeed, -this.minSpeed),
              randInt(-this.maxSpeed, this.maxSpeed),
              this.maxLife
            );
            particle.id = this.particleIndex;
            this.particles[this.particleIndex] = particle;
            break;
          case 3:
            // right edge
            particle = new SmokeParticle(
              gameObj.right,
              randInt(gameObj.top, gameObj.bottom),
              this.size,
              color,
              randInt(this.minSpeed, this.maxSpeed),
              randInt(-this.maxSpeed, this.maxSpeed),
              this.maxLife
            );
            particle.id = this.particleIndex;
            this.particles[this.particleIndex] = particle;
            break;
        }
      }
    },
    update: function() {
      this.addNewParticle();
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
      var particle = new Particle(
        i,
        j,
        size,
        gameObj.color,
        v.x,
        v.y,
        randInt(minLife, maxLife)
      );
      particles[particleIndex] = particle;
      particleIndex++;
      var v = new Vector(
        randInt(-maxSpeed * 5, maxSpeed * 5),
        randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new Particle(
        i,
        j,
        size,
        gameObj.color,
        v.x,
        v.y,
        randInt(minLife, maxLife)
      );
      particles[particleIndex] = particle;
      particleIndex++;
    }
  }
  return {
    update: function() {
      for (var id in particles) {
        var particle = particles[id];
        particle.v.y += gameObj.GRAVITY_ACCELERATION / 4 * dt;
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
      .rotateRadians(Math.random() * Math.PI / 3 - Math.PI / 6);
    var particle = new Particle(
      x,
      y,
      size,
      color,
      v.x,
      v.y,
      randInt(minLife, maxLife)
    );
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