function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// static methods
Vector.determinant = function(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};

Vector.dotProduct = function(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
};

// public non static methods
Vector.prototype.normalize = function() {
  return new Vector(this.x / this.norm, this.y / this.norm);
};

Object.defineProperties(Vector.prototype, {
  direction: {
    get: function() {
      return Math.atan2(this.y, this.x);
    },
    set: function(direction) {
      var norm = this.norm;
      this.x = norm * Math.cos(direction);
      this.y = norm * Math.sin(direction);
    }
  },
  norm: {
    get: function() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    },
    set: function(norm) {
      var ratio = this.x / this.y;
      this.x = norm * ratio / Math.sqrt(1 + ratio ** 2);
      this.y = norm / Math.sqrt(1 + ratio ** 2);
    }
  }
});
