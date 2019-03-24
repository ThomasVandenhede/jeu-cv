var Player = require("./player");
var Player = require("./player");
var Ennemy = require("./ennemy");
var Platform = require("./platform");
var MovingPlatform = require("./movingPlatform");
var skills = require("./skills");
var SkillHtml = skills.SkillHtml;
var SkillCss = skills.SkillCss;
var SkillSass = skills.SkillSass;
var SkillBootstrap = skills.SkillBootstrap;
var SkillReact = skills.SkillReact;
var SkillAngular = skills.SkillAngular;
var SkillJquery = skills.SkillJquery;
var SkillNode = skills.SkillNode;
var SkillMongo = skills.SkillMongo;
var SkillMeteor = skills.SkillMeteor;

var LevelManager = (function() {
  var level = {};

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
    this.app = props.app;
  }

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

    level.name = name;
    level.countdownStart = levelData.countdownStart;
    level.worldRect = new SDK.Rectangle({
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
        new gameEntityConstructors[ennemy.type](ennemy.props.x, ennemy.props.y)
      );
    });
    level.skills = [];
    skillsData.forEach(function(skill) {
      level.skills.push(new gameEntityConstructors[skill.type](skill.props));
    });

    // temporary objects
    level.lasers = [];
    level.particles = [];

    return level;
  };

  /**
   * Put all level entities inside a single array.
   * @param {Array} extra
   */
  LevelManager.prototype.buildEntities = function(extra) {
    level.entities = []
      .concat(level.platforms)
      .concat(level.skills)
      .concat(level.ennemies)
      .concat(level.lasers)
      .concat([level.player]);

    if (extra) {
      level.entities = level.entities.concat(extra);
    }
  };

  LevelManager.prototype.deleteLevel = function(name) {
    delete gameData.levels[name];
  };

  return LevelManager;
})();

module.exports = LevelManager;
