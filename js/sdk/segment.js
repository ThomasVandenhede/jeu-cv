class Segment {
  constructor(A, B, color) {
    this.A = A;
    this.B = B;
    this.color = color;
  }

  getBoundingRect() {
    return new AABB({
      x: Math.min(this.A.x, this.B.x),
      y: Math.min(this.A.y, this.B.y),
      width: Math.abs(this.B.x - this.A.x),
      height: Math.abs(this.B.y - this.A.y)
    });
  }

  isOrthogonalProjectedPointOnSegment(P) {
    var AB = Vector.subtract(this.B, this.A);
    var AP = Vector.subtract(P, this.A);
    var BP = Vector.subtract(P, this.B);
    return Vector.dotProduct(AB, AP) * Vector.dotProduct(AB, BP) <= 0;
  }

  getOrthogonalProjectionOfPoint(P) {
    var u = Vector.subtract(this.B, this.A).getUnitVector();
    var AP = Vector.subtract(P, this.A);
    var AH = Vector.dotProduct(AP, u);

    return Vector.sum(this.A, u.multiplyByScalar(AH));
  }

  getDistanceFromPoint(P) {
    // return Vector.subtract(this.getOrthogonalProjectionOfPoint(P), P).norm;
    var AB = Vector.subtract(this.B, this.A);
    var t = Vector.dotProduct(Vector.subtract(P, this.A), AB) / AB.norm;
    if (t < 0) {
      return Vector.subtract(A, P).norm;
    } else if (t > 1) {
      return Vector.subtract(B, P).norm;
    } else {
    }
  }

  getDistanceFromPointToLine(P) {
    var n = Vector.subtract(this.B, this.A)
      .getUnitVector()
      .getNormalVector();
    var d = Math.abs(Vector.dotProduct(Vector.subtract(P, this.A), n));
    return d;
  }

  getClosestPointOnSegment(P) {
    var AP = Vector.subtract(P, this.A);
    var AB = Vector.subtract(this.B, this.A);
    var normAB = AB.norm;
    var u = AB.multiplyByScalar(1 / normAB); // unit vector of AB
    var t = Vector.dotProduct(AP, u) / normAB;

    if (t < 0) {
      return this.A;
    } else if (t > 1) {
      return this.B;
    } else {
      var AH = Vector.dotProduct(AP, u);
      return Vector.sum(this.A, u.multiplyByScalar(AH));
    }
  }

  getPointOfIntersectionWithCircle(c) {
    var C = new Vector(c.x, c.y);
    var H = this.getClosestPointOnSegment(C);
    if ((CH = Vector.subtract(H, C).normSquared < Math.pow(c.r, 2))) {
      return H;
    }
    return false;
  }

  // intersectSegment(O, P) {
  //   var AB = Vector.subtract(this.B, this.A);
  //   var OP = Vector.subtract(P, O);
  //   if (!CollisionDroiteSeg(A, B, O, P)) {
  //     return false;
  //   }
  //   var k =
  //     -(this.A.x * OP.y - O.x * OP.y - OP.x * this.A.y + OP.x * O.y) /
  //     (AB.x * OP.y - AB.y * OP.x);
  //   return !(k < 0 || k > 1);
  // };

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.A.x, this.A.y);
    ctx.lineTo(this.B.x, this.B.y);
    ctx.stroke();
    ctx.restore();
  }
}
