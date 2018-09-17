var physics = {
  collision: {
    AABBWithAABB: function(r1, r2) {
      return (
        r1.left <= r2.right &&
        r1.right >= r2.left &&
        r1.top <= r2.bottom &&
        r1.bottom >= r2.top
      );
    },
    circleWithSegment: function(c, s) {
      var C = new Vector(c.x, c.y);
      var H = s.getPointOfIntersectionWithCircle(c);

      if (H) {
        return H;
      }
      return false;
    },
    lineSegmentCollision: function(A, B, O, P) {
      var AB = Vector.subtract(B, A);
      var AP = Vector.subtract(P, A);
      var AO = Vector.subtract(O, A);
      return Vector.determinant(AB, AP) * Vector.determinant(AB, AO) < 0;
    },
    segmentWithSegment: function(A, B, O, P) {
      if (!this.lineSegmentCollision(A, B, O, P)) {
        return Number.POSITIVE_INFINITY;
      }
      var AB = Vector.subtract(B, A);
      var OP = Vector.subtract(P, O);
      var numerator = -(A.x * OP.y - O.x * OP.y - OP.x * A.y + OP.x * O.y);
      var denominator = Vector.determinant(AB, OP);
      k = toFixedPrecision(numerator / denominator, 2);

      if (k < 0 || k > 1) {
        return Number.POSITIVE_INFINITY;
      } else {
        return k;
      }
    },
    segmentAABB: function(A, B, box) {
      var AB = Vector.subtract(B, A);
      var points = [
        new Vector(box.left, box.top),
        new Vector(box.right, box.top),
        new Vector(box.right, box.bottom),
        new Vector(box.left, box.bottom)
      ];
      var rayFraction = Number.POSITIVE_INFINITY;
      var sides = [[0, 1], [-1, 0], [0, -1], [1, 0]];
      var side;

      for (var i = 0; i < 4; i++) {
        var edge = new Segment(points[i], points[(i + 1) % 4]);
        var newRayFraction = this.segmentWithSegment(A, B, edge.A, edge.B);
        if (newRayFraction < rayFraction) {
          rayFraction = newRayFraction;
          side = sides[i];
        }
      }

      return {
        t: rayFraction,
        side: side
      };
    }
  }
};
