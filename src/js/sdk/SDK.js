var SDK = {
  Game: require("./Game"),
  Rectangle: require("./geometry/rectangle"),
  Circle: require("./geometry/circle"),
  Vector: require("./geometry/vector"),
  Segment: require("./geometry/segment"),
  Camera: require("./camera"),
  GameTimer: require("./gameTimer"),
  Grid: require("./grid"),
  Input: require("./input"),
  Keyboard: require("./input/keyboard/Keyboard"),
  MouseManager: require("./input/mouse/mouseManager"),
  TouchManager: require("./input/touch/touchManager"),
  Particle: require("./particle"),
  physics: require("./physics"),
  Sound: require("./sound"),
  SoundManager: require("./soundManager"),
  Tile: require("./tile"),
  Tilemap: require("./tilemap"),
};

module.exports = SDK;

global.SDK = SDK;
