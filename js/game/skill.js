class Skill extends AABB {
  constructor(props) {
    super(props);

    this.v = new Vector();
    this.solid = false;
    this.image = new Image();
    this.image.src = props.src;
  }

  update() {}

  draw(ctx, camera) {
    var applyCamToArr = function() {
      return Object.values(camera.apply.apply(camera, arguments));
    };
    ctx.save();
    ctx.drawImage.apply(
      ctx,
      [this.image]
        .concat(applyCamToArr(this.x, this.y))
        .concat([this.width * camera.zoomLevel, this.height * camera.zoomLevel])
    );
    ctx.restore();
  }
}
