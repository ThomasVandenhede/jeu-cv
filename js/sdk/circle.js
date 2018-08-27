class Circle {
  constructor(props) {
    this.x = props.x;
    this.y = props.y;
    this.r = props.r;
    this.color = props.color || "grey";
    this.fill = false;
  }

  containsPoint(P) {
    // return (
    //   Vector.subtract(P, new Vector(this.x, this.y)).normSquared <
    //   Math.pow(this.r, 2)
    // );
    return (
      Math.pow(P.x - this.x, 2) + Math.pow(P.y - this.y, 2) <
      Math.pow(this.r, 2)
    );
  }

  getBoundingRect() {
    return new AABB({
      x: this.x - this.r,
      y: this.y - this.r,
      width: this.r * 2,
      height: this.r * 2
    });
  }

  draw(ctx) {
    ctx.save();
    // this.fill = true;
    if (this.fill) {
      ctx.fillStyle = this.color;
    } else {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    this.fill ? ctx.fill() : ctx.stroke();
    ctx.restore();
  }
}
