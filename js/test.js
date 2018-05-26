var md = AABB.minkowskiDifference(boxA, boxB);

if (md.left <= 0 && md.right >= 0 && md.top <= 0 && md.bottom >= 0) {
  // normal discrete collision detection / separation code
} else {
  var relativeMotion = Vector.subtract(boxB.v, boxA.v).multiplyByScalar(dt);

  // ray-cast the relativeMotion vector against the Minkowski AABB
  var h = md.getRayIntersectionFraction(new Vector(), relativeMotion);

  // check to see if a collision will happen this frame
  // getRayIntersectionFraction returns Math.POSITIVE_INFINITY if there is no intersection
  if (h < Math.POSITIVE_INFINITY) {
    // yup, there WILL be a collision this frame
    // move the boxes appropriately
    boxA.x += boxA.v.x * dt * h;
    boxA.y += boxA.v.y * dt * h;
    boxB.x += boxB.v.x * dt * h;
    boxB.y += boxB.v.y * dt * h;

    // zero the normal component of the velocity
    // (project the velocity onto the tangent of the relative velocities
    //  and only keep the projected component, tossing the normal component)
    var n = relativeMotion.getUnitVector().getNormalVector();
    boxA.v = Vector.determinant(Vector.dotProduct(boxA.v, n), n);
    boxB.v = Vector.determinant(Vector.dotProduct(boxB.v, n), n);
  } else {
    // no intersection, move it along
    boxA.x += boxA.v.x * dt;
    boxA.y += boxA.v.y * dt;
    boxB.x += boxB.v.x * dt;
    boxB.y += boxB.v.y * dt;
  }
}

// taken from https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
// which was adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
// returns the point where they intersect (if they intersect)
// returns Math.POSITIVE_INFINITY if they don't intersect
function getRayIntersectionFractionOfFirstRay(originA, endA, originB, endB) {
  var r = Vector.subtract(endA, originA);
  var s = Vector.subtract(endB, originB);

  var numerator = Vector.determinant(Vector.subtract(originB, originA), r);
  var denominator = Vector.determinant(r, s);

  if (numerator == 0 && denominator == 0) {
    // the lines are co-linear
    // check if they overlap
    // todo: calculate intersection point
    return Math.POSITIVE_INFINITY;
  }
  if (denominator == 0) {
    // lines are parallel
    return Math.POSITIVE_INFINITY;
  }

  var u = numerator.multiplyByScalar(1 / denominator);

  // t is the fraction of the first ray normalized between [0, 1]
  var t = Vector.determinant(
    Vector.subtract(originB, originA),
    s
  ).multiplyByScalar(1 / denominator);

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return t;
  }
  return Math.POSITIVE_INFINITY;
}

function getRayIntersectionFraction(origin, direction) {
  var end = Vector.sum(origin, direction);

  // for each of the AABB's four edges
  // calculate the minimum fraction of "direction"
  // in order to find where the ray FIRST intersects
  // the AABB (if it ever does)
  var minT = getRayIntersectionFractionOfFirstRay(
    origin,
    end,
    new Vector(min.x, min.y),
    new Vector(min.x, max.y)
  );
  var x;
  x = getRayIntersectionFractionOfFirstRay(
    origin,
    end,
    new Vector(min.x, max.y),
    new Vector(max.x, max.y)
  );
  if (x < minT) minT = x;
  x = getRayIntersectionFractionOfFirstRay(
    origin,
    end,
    new Vector(max.x, max.y),
    new Vector(max.x, min.y)
  );
  if (x < minT) minT = x;
  x = getRayIntersectionFractionOfFirstRay(
    origin,
    end,
    new Vector(max.x, min.y),
    new Vector(min.x, min.y)
  );
  if (x < minT) minT = x;

  // ok, now we should have found the fractional component along the ray where we collided
  return minT;
}
