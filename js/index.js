<<<<<<< HEAD
var player = PlayerFactory(100, 0);

=======
>>>>>>> platform
(function game() {
  var keyboard = keyboardManager.getInstance();
  var keyboard1 = keyboardManager.getInstance();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var drawables = [];
  var player = playerFactory(100, 0);
  var platform1 = platformFactory(0, 350, 200, 20);
  var platform2 = platformFactory(350, 250, 250, 20);
  var platform3 = platformFactory(0, 150, 200, 20);
  drawables.push(
    player,
    platform1,
    platform2,
    platform3
  );

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
    
    if (keyboard.ENTER) {
      console.log('enter');
    }
    
    player.update();
    clearCanvas();
<<<<<<< HEAD
    player.draw(ctx);

    requestAnimationFrame(render);
  };

=======
    for (var i = 0; i < drawables.length; i++) {
      drawables[i].draw(ctx);
    }

    requestAnimationFrame(render);
  };

>>>>>>> platform
  requestAnimationFrame(render)
}());