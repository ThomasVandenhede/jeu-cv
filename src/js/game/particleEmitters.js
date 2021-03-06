var SmokeParticle = require("./smokeParticle");
var utils = require("../utils");

var sparksParticles = function(gameObj) {
  var start = Date.now();

  return {
    particleIndex: 0,
    particles: {},
    minSpeed: 5,
    maxSpeed: 20,
    maxSize: 20,
    minSize: 3,
    maxLife: 2000,
    duration: 200,
    addNewParticle: function() {
      this.particleIndex++;
      var t = (this.duration - (Date.now() - start)) / this.duration;
      var size = utils.lerp(this.minSize, this.maxSize, t);
      var color = !gameObj.hasWon
        ? gameObj.color
        : "rgb(" +
          utils.randInt(0, 255) +
          ", " +
          utils.randInt(0, 255) +
          ", " +
          utils.randInt(0, 255) +
          ")";
      switch (utils.randInt(0, 3)) {
        case 0:
          // top edge
          particle = new SmokeParticle({
            x: utils.randInt(gameObj.left, gameObj.right),
            y: gameObj.top - size,
            size: size,
            color: color,
            vx: utils.randInt(-this.maxSpeed, this.maxSpeed),
            vy: utils.randInt(-this.maxSpeed, -this.minSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 1:
          // bottom edge
          particle = new SmokeParticle({
            x: utils.randInt(gameObj.left, gameObj.right),
            y: gameObj.bottom,
            size: size,
            color: color,
            vx: utils.randInt(-this.maxSpeed, this.maxSpeed),
            vy: utils.randInt(this.minSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 2:
          // left edge
          particle = new SmokeParticle({
            x: gameObj.left - size,
            y: utils.randInt(gameObj.top, gameObj.bottom),
            size: size,
            color: color,
            vx: utils.randInt(-this.maxSpeed, -this.minSpeed),
            vy: utils.randInt(-this.maxSpeed, this.maxSpeed),
            maxLife: this.maxLife
          });
          particle.id = this.particleIndex;
          this.particles[this.particleIndex] = particle;
          break;
        case 3:
          // right edge
          particle = new SmokeParticle({
            x: gameObj.right,
            y: utils.randInt(gameObj.top, gameObj.bottom),
            size: size,
            color: color,
            vx: utils.randInt(this.minSpeed, this.maxSpeed),
            vy: utils.randInt(-this.maxSpeed, this.maxSpeed),
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
      var v = new SDK.Vector(
        utils.randInt(-maxSpeed * 5, maxSpeed * 5),
        utils.randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new SDK.Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: utils.randInt(minLife, maxLife)
      });
      particles[particleIndex] = particle;
      particleIndex++;
      var v = new SDK.Vector(
        utils.randInt(-maxSpeed * 5, maxSpeed * 5),
        utils.randInt(
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * maxSpeed * 10,
          -Math.sign(gameObj.GRAVITY_ACCELERATION) * minSpeed * 10
        )
      );
      var particle = new SDK.Particle({
        x: i,
        y: j,
        size: size,
        color: gameObj.color,
        vx: v.x,
        vy: v.y,
        maxLife: utils.randInt(minLife, maxLife)
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
  var maxCount = 30;
  var minSize = 2;
  var maxSize = 6;
  var minLife = 300;
  var maxLife = 500;
  var minSpeed = 10;
  var maxSpeed = 200;
  var particles = {};
  for (var i = 0; i < maxCount; i++) {
    var v = direction
      .getUnitVector()
      .scale(utils.randInt(minSpeed, maxSpeed))
      .rotateRadians((Math.random() * Math.PI) / 3 - Math.PI / 6);
    particleIndex++;
    var particle = new SDK.Particle({
      id: particleIndex,
      particles: particles,
      x: x,
      y: y,
      size: utils.randInt(minSize, maxSize),
      color: color,
      vx: v.x,
      vy: v.y,
      maxLife: utils.randInt(minLife, maxLife),
      circle: true
    });
    particles[particleIndex] = particle;
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

module.exports = {
  sparksParticles: sparksParticles,
  explosionParticles: explosionParticles,
  hitParticles: hitParticles
};
