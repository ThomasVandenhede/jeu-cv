var Skill = (function() {
  function Skill(props) {
    SDK.Rectangle.call(this, props);

    this.v = new SDK.Vector();
    this.solid = false;
    this.image = new Image();
    this.image.src = props.src;
  }

  Skill.prototype = Object.create(SDK.Rectangle.prototype);
  Skill.prototype.constructor = Skill;

  Skill.prototype.update = function() {};

  Skill.prototype.draw = function(ctx, camera) {
    ctx.save();
    ctx.drawImage(
      this.image,
      camera.applyToX(this.x),
      camera.applyToY(this.y),
      camera.applyToDistance(this.width),
      camera.applyToDistance(this.height)
    );
    ctx.restore();
  };

  return Skill;
})();

module.exports = Skill;
