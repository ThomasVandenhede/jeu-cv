function SkillBar(props) {
  this.player = props.player;
  this.skills = props.skills;
}

SkillBar.prototype.draw = function(ctx) {
  var acquiredSkillsCount = this.player.skills.length;
  var totalSkillsCount = acquiredSkillsCount + this.skills.length;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(
    60,
    100,
    100,
    100 + ((acquiredSkillsCount + (acquiredSkillsCount % 2)) / 2) * 45
  );
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "16px arial";
  ctx.fillText("Skills", 110, 130);
  ctx.fillText(acquiredSkillsCount + " / " + totalSkillsCount, 110, 160);
  this.player.skills.forEach(function(skill, index) {
    ctx.drawImage(
      skill.image,
      70 + (index % 2) * 45,
      200 + ((index - (index % 2)) / 2) * 45,
      30,
      30
    );
  }, this);
  ctx.restore();
};

module.exports = SkillBar;
