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

class LevelManager {
  constructor() {
    if (!LevelManager.instance) {
      LevelManager.instance = this;
    }
    this.data = gameData;
    return LevelManager.instance;
  }

  buildLevel(name) {
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

    // temporary objects
    level.lasers = [];
    level.particles = [];

    return level;
  }

  buildEntities() {
    level.entities = []
      .concat(level.platforms)
      .concat(level.skills)
      .concat(level.ennemies)
      .concat(level.lasers)
      .concat([level.player]);
  }

  deleteLevel(name) {
    delete gameData.levels[name];
  }
}
