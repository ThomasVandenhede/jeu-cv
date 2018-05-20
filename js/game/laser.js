var Laser = (function () {
  function Laser(A, B, color) {
    Segment.call(this, A, B);

    this.color = color;
  }

  return Laser;
})();
