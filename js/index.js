(function game() {
  var keyboard = keyboardManager.getInstance();
  var keyboard1 = keyboardManager.getInstance();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var drawables = [];
  var player = playerFactory(100, 0);
  var ground = platformFactory(0, canvas.height - 10, canvas.width, 10);
  var platform1 = platformFactory(0, 350, 200, 2);
  var platform2 = platformFactory(350, 250, 250, 2);
  var platform3 = platformFactory(0, 150, 180, 2);
  var platform4 = platformFactory(canvas.width - 100, canvas.height - 40, 100, 10);
  var platform5 = platformFactory(330, canvas.height - 100, 10, 100);
  drawables.push(
    player,
    ground,
    platform1,
    platform2,
    platform3,
    platform4,
    platform5
  );

  player.collidableWith = drawables.filter(function(el) {
    return el !== player;
  });

  console.log(player.collidableWith);

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function render() {
    if (keyboard.RIGHT || keyboard.LEFT) {
      if (keyboard.LEFT) {
        player.speed.x = -20;
      }
      
      if (keyboard.RIGHT) {
        player.speed.x = 20;
      }
    } else {
      player.speed.x = 0;
    }
    
    if (keyboard.UP) {
      player.jump();
    }
    
    if (keyboard.SPACE) {
      console.log('space');
      player.jump();
    }

    if (keyboard.DOWN) {
      player.crouch();
    } else {
      player.stand();
    }
    
    player.update();
    clearCanvas();
    for (var i = 0; i < drawables.length; i++) {
      drawables[i].draw(ctx);
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render)
}());