var SDK = {
  Rectangle: require("./geometry/rectangle"),
  Circle: require("./geometry/circle"),
  Vector: require("./geometry/vector"),
  Segment: require("./geometry/segment"),
  Camera: require("./camera"),
  GameTimer: require("./gameTimer"),
  Grid: require("./grid"),
  KeyboardManager: require("./keyboardManager"),
  MouseManager: require("./mouseManager"),
  Particle: require("./particle"),
  physics: require("./physics"),
  Sound: require("./sound"),
  SoundManager: require("./soundManager"),
  Tile: require("./tile"),
  Tilemap: require("./tilemap"),
  TouchManager: require("./touchManager"),
};

module.exports = SDK;

global.SDK = SDK;
