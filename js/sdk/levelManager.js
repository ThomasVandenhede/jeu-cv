var levelManager = (function() {
  var instance;

  var gameEntityConstructors = {
    Player: Player,
    Ennemy: Ennemy,
    Platform: Platform,
    MovingPlatform: MovingPlatform,
    SkillHtml: SkillHtml,
    SkillCss: SkillCss,
    SkillSass: SkillSass,
    SkillBootstrap: SkillBootstrap,
    SkillReact: SkillReact,
    SkillAngular: SkillAngular,
    SkillJquery: SkillJquery,
    SkillNode: SkillNode,
    SkillMongo: SkillMongo,
    SkillMeteor: SkillMeteor
  };

  function LevelManager(props) {
    this.data = props.data;
  }

  LevelManager.prototype.init = function(app) {
    this.app = app;
  };

  LevelManager.prototype.buildLevel = function(name) {
    if (!gameData.levels[name]) {
      return null;
    }
    var levelData = gameData.levels[name];
    var name = levelData.name;
    var worldRectData = levelData.worldRect;
    var playerData = levelData.player;
    var platformsData = levelData.platforms;
    var ennemiesData = levelData.ennemies;
    var skillsData = levelData.skills;

    var level = {};

    level.name = name;
    level.countdownStart = levelData.countdownStart;
    level.worldRect = new AABB({
      x: worldRectData.props.x,
      y: worldRectData.props.y,
      width: worldRectData.props.width,
      height: worldRectData.props.height
    });
    level.player = new gameEntityConstructors[playerData.type](
      playerData.props
    );
    level.platforms = [];
    platformsData.forEach(function(platform) {
      level.platforms.push(
        new gameEntityConstructors[platform.type](platform.props)
      );
    });
    level.ennemies = [];
    ennemiesData.forEach(function(ennemy) {
      level.ennemies.push(
        new gameEntityConstructors[ennemy.type](ennemy.props)
      );
    });
    level.skills = [];
    skillsData.forEach(function(skill) {
      level.skills.push(new gameEntityConstructors[skill.type](skill.props));
    });

    return level;
  };

  LevelManager.prototype.deleteLevel = function(name) {
    delete gameData.levels[name];
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new LevelManager({ data: gameData });
      }
      return instance;
    }
  };
})();
