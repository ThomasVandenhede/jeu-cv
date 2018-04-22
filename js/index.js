var player = new PlayerFactory(100, 100);

var game = (function() {
  var keyboard = keyboardManager.getInstance();
  var keyboard1 = keyboardManager.getInstance();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  (function mainLoop() {
  
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    if (keyboard.LEFT) {
      console.log('move left');
    }

    if (keyboard.RIGHT) {
      console.log('move right');
    }

    if (keyboard.UP) {
      console.log('move up');
    }

    if (keyboard.DOWN) {
      console.log('move down');
    }

    if (keyboard.ENTER) {
      console.log('enter');
    }

    if (keyboard.SPACE) {
      console.log('space');
    }

    player.draw(ctx);

    requestAnimationFrame(mainLoop);
  }());
}());