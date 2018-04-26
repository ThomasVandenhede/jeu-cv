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
