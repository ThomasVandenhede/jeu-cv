var SDK = {
  Rectangle: require("./Rectangle"),
  Camera: require("./camera"),
  Circle: require("./circle"),
  GameTimer: require("./gameTimer"),
  Grid: require("./grid"),
  KeyboardManager: require("./keyboardManager"),
  MouseManager: require("./mouseManager"),
  Particle: require("./particle"),
  physics: require("./physics"),
  Segment: require("./segment"),
  Sound: require("./sound"),
  SoundManager: require("./soundManager"),
  Tile: require("./tile"),
  Tilemap: require("./tilemap"),
  TouchManager: require("./touchManager"),
  Vector: require("./vector")
};

module.exports = SDK;

global.SDK = SDK;
