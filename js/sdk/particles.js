var sparksParticles = function(gameObj) {
  return {
    particleIndex: 0,
    maxCount: 50,
    particles: {},
    color: gameObj.color,
    minSpeed: 5,
    maxSpeed: 20,
    size: 4,
    maxLife: 500,
    addNewParticle: function() {
      if (Object.keys(this.particles).length < this.maxCount) {
        this.particleIndex++;
        var particle;
        var color = this.color;
        // var color =
        //   "rgb(" +
        //   randInt(0, 255) +
        //   ", " +
        //   randInt(0, 255) +
        //   ", " +
        //   randInt(0, 255) +
        //   ")";
        switch (randInt(0, 3)) {
          case 0:
            particle = new Particle(
              randInt(gameObj.left, gameObj.right),
              gameObj.top,
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
            particle = new Particle(
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
            particle = new Particle(
              gameObj.left,
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
            particle = new Particle(
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
  var minLife = 300;
  var maxLife = 1000;
  var particles = [];
  var minSpeed = 4;
  var maxSpeed = 8;
  var color = gameObj.color;
  var particleIndex = 0;
  for (var i = gameObj.left; i < gameObj.right; i += size) {
    for (var j = gameObj.top; j < gameObj.bottom; j += size) {
      var center = gameObj.center;
      var v = new Vector(i + size / 2 - center.x, j + size / 2 - center.y);
      v = v.multiplyByScalar(randInt(minSpeed, maxSpeed));
      var particle = new Particle(
        i,
        j,
        size,
        color,
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
