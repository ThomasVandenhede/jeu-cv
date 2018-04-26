function Rectangle(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
  this.right = left + width;
  this.bottom = top + height;
}

Rectangle.prototype.set = function(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width || this.width;
  this.height = height || this.height;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
};

Rectangle.prototype.move = function(dx, dy) {
  this.left += dx;
  this.top += dy;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
};

Rectangle.prototype.moveTo = function(left, top) {
  this.left = left;
  this.top = top;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
};

Rectangle.prototype.within = function(r) {
  return (r.left <= this.left && 
          r.right >= this.right &&
          r.top <= this.top && 
          r.bottom >= this.bottom);
}       

Rectangle.prototype.overlaps = function(r) {
  return (this.left < r.right && 
          r.left < this.right && 
          this.top < r.bottom &&
          r.top < this.bottom);
}