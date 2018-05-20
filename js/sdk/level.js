var level = (function () {
    function Level(data) {
        this.data = data;
    }

    Level.prototype.build = function () {
        var name = this.data.name;
        var worldRect = this.data.worldRect;
        var player = this.data.player;
        var platforms = this.data.platforms;
        var ennemies = this.data.ennemies;

        this.name = name;
        this.worldRect = new worldRect.type(world.options);
        this.player = new player.type(player.options);
        this.platforms = [];
        for (var i = 0; i < platforms.length; i++) {
            var platform = platforms[i];
            this.patforms.push(new platform.type(platform.options));
        }
        this.ennemies = []
        for (var i = 0; i < ennemies.length; i++) {
            var ennemy = ennemies[i];
            this.ennemies.push(ennemy.type(ennemy.options));
        }
    }

    return Level;
})();
