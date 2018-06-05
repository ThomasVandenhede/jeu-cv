var level = (function() {
  function Level(data) {
    this.data = data;
  }

  Level.prototype.build = function() {
    var name = this.data.name;
    var worldRect = this.data.worldRect;
    var player = this.data.player;
    var platforms = this.data.platforms;
    var ennemies = this.data.ennemies;

    this.name = name;
    this.worldRect = new worldRect.type(world.options);
    this.player = new player.type(player.options);
    this.platforms = [];
    platforms.forEach(function(platform) {
      this.patforms.push(new platform.type(platform.options));
    });
    ennemies.forEach(function(ennemy) {
      this.ennemies.push(ennemy.type(ennemy.options));
    });
  };

  return Level;
})();
