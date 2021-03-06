var LifeBar = (function() {
  function LifeBar(props) {
    SDK.Rectangle.call(this, props);
    this.gameObject = props.gameObject;
  }

  LifeBar.prototype = Object.create(SDK.Rectangle.prototype);
  LifeBar.prototype.constructor = LifeBar;

  LifeBar.prototype.draw = function(ctx) {
    var hitPointsRation = this.gameObject.getHitPointsRatio();
    var lineWidth = 1;

    ctx.save();
    // life bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // life bar hit points
    ctx.fillStyle = "hsl(" + hitPointsRation * 120 + ", 100%, 40%)";
    ctx.fillRect(this.x, this.y, this.width * hitPointsRation, this.height);

    // life bar outline
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeRect(
      this.x - lineWidth / 2,
      this.y - lineWidth / 2,
      this.width + lineWidth,
      this.height + lineWidth
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fontWeight = "bold";
    ctx.fillText(
      Math.ceil(utils.toFixedPrecision(hitPointsRation * 100)) + "%",
      this.x + this.width / 2,
      this.y + this.height + 20
    );
    ctx.restore();
  };

  return LifeBar;
})();

module.exports = LifeBar;
