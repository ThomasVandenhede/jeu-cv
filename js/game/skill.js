var Skill = (function() {
  function Skill(props) {
    AABB.call(this, props);

    this.v = new Vector();
    this.solid = false;
    this.image = new Image();
    this.image.src = props.src;
  }

  Skill.prototype = Object.create(AABB.prototype);
  Skill.prototype.constructor = Skill;

  Skill.prototype.update = function() {};

  Skill.prototype.draw = function(ctx, camera) {
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
  };

  return Skill;
})();
