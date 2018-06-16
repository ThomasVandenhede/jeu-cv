var CreationTool = (function() {
  var defaultOptions = {
    Player: {},
    Ennemy: {},
    Skill: {},
    Platform: {
      passthrough: false
    },
    MovingPlatform: {
      passthrough: false,
      positionRatio: 0
    }
  };

  function CreationTool(props) {
    this.gameObjects = props.gameObjects;
    this.camera = props.camera;
    this.mouse = props.mouse;
    this.grid = props.grid;
    this.canvas = props.canvas;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.eventHandlers = {
      mouse: {
        mousedown: {
          handler: this.handleMouseDown,
          props: undefined
        },
        mouseup: {
          handler: this.handleMouseUp,
          props: undefined
        },
        mousemove: {
          handler: this.handleMouseMove,
          props: undefined
        }
      }
    };
  }

  CreationTool.prototype.handleMouseDown = function handleMouseDown(e) {
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );

    switch (e.button) {
      case 0:
        // left mouse button
        var Constructor = this.gameObjectConstructor;
        var gameObject = new Constructor({
          x: mouseGamePosSnappedToGrid.x,
          y: mouseGamePosSnappedToGrid.y
        });
        this.gameObjects.push(gameObject);
        switch (Constructor.name) {
          case "Platform":
          case "MovingPlatform":
            this.currentObject = gameObject;
            break;
          default:
            this.currentObject = null;
            break;
        }
        break;
      default:
        break;
    }
  };

  CreationTool.prototype.handleMouseUp = function handleMouseUp(e) {
    switch (e.button) {
      case 0: // left mouse button
        this.canvas.style.cursor = "";
        break;
      case 2: // right mouse button
        this.clickedObject = null;
        break;
      default:
        break;
    }
  };

  CreationTool.prototype.handleMouseMove = function handleMouseMove(e) {
    var clickGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.clickX,
      this.mouse.clickY
    );
    var mouseGamePosSnappedToGrid = this.grid.getMouseGamePosSnappedToGrid(
      this.mouse.x,
      this.mouse.y
    );
    var mouseGameDisplacement = Vector.subtract(
      mouseGamePosSnappedToGrid,
      clickGamePosSnappedToGrid
    );

    // move this.camera when mouse wheel is held down
    if (this.mouse.buttons[0]) {
      if (this.currentObject) {
        this.currentObject.width = Math.max(0, mouseGameDisplacement.x);
        this.currentObject.height = Math.max(0, mouseGameDisplacement.y);
      }
    }
  };

  return CreationTool;
})();
