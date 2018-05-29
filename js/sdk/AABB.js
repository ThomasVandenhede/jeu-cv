function AABB(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Object.defineProperties(AABB.prototype, {
  left: {
    get: function() {
      return this.x;
    },
    set: function(left) {
      this.x = left;
    }
  },
  top: {
    get: function() {
      return this.y;
    },
    set: function(left) {
      this.y = bottom;
    }
  },
  right: {
    get: function() {
      return this.x + this.width;
    },
    set: function(right) {
      if (this.width === Number.POSITIVE_INFINITY) {
        this.x = Number.NEGATIVE_INFINITY; // edge case
      } else {
        this.x = right - this.width;
      }
    }
  },
  bottom: {
    get: function() {
      return this.y + this.height;
    },
    set: function(bottom) {
      if (this.height === Number.POSITIVE_INFINITY) {
        this.y = Number.NEGATIVE_INFINITY; // edge case
      } else {
        this.y = bottom - this.height;
      }
    }
  }
});

// static methods
AABB.minkowskiDifference = function(r1, r2) {
  return new AABB(
    r1.left - r2.right,
    r1.top - r2.bottom,
    r1.width + r2.width,
    r1.height + r2.height
  );
};

// public methods
AABB.prototype.set = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width || this.width;
  this.height = height || this.height;
};

AABB.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
};

AABB.prototype.within = function(r) {
  return (
    r.left <= this.left &&
    r.right >= this.right &&
    r.top <= this.top &&
    r.bottom >= this.bottom
  );
};

AABB.prototype.overlaps = function(r) {
  return (
    this.left < r.right &&
    r.left < this.right &&
    this.top < r.bottom &&
    r.top < this.bottom
  );
};

AABB.prototype.contains = function(x, y) {
  return (
    x >= this.left && this <= this.right && y >= this.top && y <= this.bottom
  );
};

AABB.prototype.containsStrict = function(x, y) {
  return x > this.left && this < this.right && y > this.top && y < this.bottom;
};
