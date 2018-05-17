window.addEventListener("DOMContentLoaded", function() {
  function fitCanvasToClient() {
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
  }

  fitCanvasToClient();
  window.addEventListener("resize", fitCanvasToClient);

  (function game() {
    var previousTime, currentTime;
    var keyboard = keyboardManager.getInstance();
    var keyboard1 = keyboardManager.getInstance();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var drawables = [];
    var player = playerFactory(100, -100);
    var ground = platformFactory(0, canvas.height - 10, canvas.width, 10);
    var platform1 = platformFactory(0, 350, 200, 1);
    var platform2 = platformFactory(350, 250, 250, 1);
    var platform3 = platformFactory(0, 150, 180, 1);
    var platform4 = platformFactory(0, 120, 180, 1);
    var platform5 = platformFactory(330, canvas.height - 100, 10, 100);
    var platform6 = platformFactory(
      canvas.width - 100,
      canvas.height - 40,
      80,
      10
    );
    var platform7 = platformFactory(
      canvas.width - 100,
      canvas.height - 70,
      80,
      10
    );
    var platform8 = platformFactory(
      canvas.width - 100,
      canvas.height - 100,
      80,
      10
    );
    var platform9 = platformFactory(
      canvas.width - 100,
      canvas.height - 130,
      80,
      10
    );
    drawables.push(
      player,
      ground,
      platform1,
      platform2,
      platform3,
      platform4,
      platform5,
      platform6,
      platform7,
      platform8,
      platform9
    );

    player.collidableWith = drawables.filter(function(el) {
      return el !== player;
    });

    var camera = new Camera(0, 0, canvas.width, canvas.height, 2000, 2000);
    camera.follow(player, canvas.width / 2, canvas.height / 2);

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
      previousTime = currentTime || Date.now();
      currentTime = Date.now();
      dt = (currentTime - previousTime) / 1000;

      if (keyboard.RIGHT || keyboard.LEFT) {
        if (keyboard.LEFT) {
          player.moveLeft();
        }

        if (keyboard.RIGHT) {
          player.moveRight();
        }
      } else {
        player.v.x = 0;
      }

      if (keyboard.UP) {
        player.jump();
      }

      if (keyboard.SPACE) {
        player.jump();
      }

      if (keyboard.DOWN) {
        player.crouch();
      } else {
        player.stand();
      }

      player.applyGravity();
      player.detectCollisions();
      player.update(dt);
      camera.update();

      clearCanvas();
      for (var i = 0; i < drawables.length; i++) {
        drawables[i].draw(ctx, camera);
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  })();
});
