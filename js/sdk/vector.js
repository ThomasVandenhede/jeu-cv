class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static sum() {
    var x = 0,
      y = 0;
    for (var i = 0; i < arguments.length; i++) {
      x += arguments[i].x;
      y += arguments[i].y;
    }
    return new Vector(x, y);
  }

  static subtract(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static determinant(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  static dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  multiplyByScalar(a) {
    return new Vector(this.x * a, this.y * a);
  }

  getUnitVector() {
    var norm = this.norm;
    if (norm === 0) {
      return new Vector();
    } else {
      return new Vector(this.x, this.y).multiplyByScalar(1 / norm);
    }
  }

  getNormalVector() {
    return new Vector(-this.y, this.x);
  }

  rotateRadians(angle) {
    return new Vector(
      Math.cos(angle) * this.x - Math.sin(angle) * this.y,
      Math.sin(angle) * this.x + Math.cos(angle) * this.y
    );
  }

  get direction() {
    return Math.atan2(this.y, this.x);
  }

  set direction(direction) {
    var norm = this.norm;
    this.x = norm * Math.cos(direction);
    this.y = norm * Math.sin(direction);
  }

  get normSquared() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  }

  get norm() {
    return Math.sqrt(this.normSquared);
  }
  set norm(norm) {
    var ratio = this.x / this.y;
    this.x = (norm * ratio) / Math.sqrt(1 + Math.pow(ratio, 2));
    this.y = norm / Math.sqrt(1 + Math.pow(ratio, 2));
  }
}
