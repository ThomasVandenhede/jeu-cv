var player = new PlayerFactory(100, 100);
  
// Singleton pattern
var keyboardManager = (function () {
  var instance;
  function init() {
    var keyMappings = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'Enter': 'ENTER',
    }

    window.onkeydown = function(event) {
      console.log(event.code, event.key);
      if (keyMappings[event.code]) {

      }
    }
    
    return {
      listen: function() {
        window.onkeydown = function() {
          
        };
        window.onkeyup = function() {
          
        };
      },
    };
  };

  return {
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
}());

var game = (function() {
  var keyboard = keyboardManager.getInstance();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  (function mainLoop() {
  
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    player.draw(ctx);

    requestAnimationFrame(mainLoop);
  }());
}());