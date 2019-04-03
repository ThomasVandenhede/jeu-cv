var Keyboard = require("./input/keyboard/Keyboard");
var TouchManager = require("./input/touch/touchManager");
var SoundManager = require("./sound/soundManager");
var Camera = require("./camera");
var GameTimer = require("./gameTimer");

function Game() {
  // initalize canvas(es) and html elements
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");

  // initialize keyboard & sound
  this.keyboard = new Keyboard(this);
  this.touchInput = new TouchManager(this);
  this.soundManager = new SoundManager(gameData);

  // camera
  this.camera = new Camera({
    canvas: this.canvas
  });

  // game timer (game inner logic)
  this.timer = new GameTimer();
}

/**
 * Main method. Runs game simulation.
 */
Game.prototype.step = function() {
  this.timer.update();
  dt = this.timer.dt;

  this.update();
  this.render(this.ctx, this.camera);

  this.frame = requestAnimationFrame(this.step.bind(this));
};

module.exports = Game;
