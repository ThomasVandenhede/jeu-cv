var Rectangle = (function() {
  function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  Object.prototype.setX = function(x) {
    this.x = x;
  }

  Object.defineProperties(Rectangle.prototype, {
    left: {
      get: function() {
        return this.x;
      },
      set: function(left) {
        this.x = left;
      },
    },
    top: {
      get: function() {
        return this.y;
      },
      set: function(left) {
        this.y = bottom;
      },
    },
    right: {
      get: function() {
        return this.x + this.width;;
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

  Rectangle.prototype.set = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width || this.width;
    this.height = height || this.height;
  };

  Rectangle.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
  };

  Rectangle.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Rectangle.prototype.within = function(r) {
    return (
      r.left <= this.left &&
      r.right >= this.right &&
      r.top <= this.top &&
      r.bottom >= this.bottom
    );
  };

  Rectangle.prototype.overlaps = function(r) {
    return (
      this.left < r.right &&
      r.left < this.right &&
      this.top < r.bottom &&
      r.top < this.bottom
    );
  };

  return Rectangle;
})();
