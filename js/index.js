var player = PlayerFactory(100, 0);

(function game() {
  var keyboard = keyboardManager.getInstance();
  var keyboard1 = keyboardManager.getInstance();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

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
    player.draw(ctx);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render)
}());