var toolManager = (function() {
  var instance = null;

  function ToolManager() {}

  Object.defineProperties(ToolManager.prototype, {
    tool: {
      get: function() {
        return this.toolID;
      },
      set: function(id) {
        console.log("​ToolManager -> id", id);
        if (id !== this.toolID) {
          this.unsetEventHandlersForTool(this.toolID);
          this.setEventHandlersForTool(id);
          this.toolID = id;
        }
      }
    }
  });

  ToolManager.prototype.init = function(props) {
    this.tools = props.tools;
    this.mouse = props.mouse;
    this.canvas = props.canvas;
    this.toolID = 0;
    this.setEventHandlersForTool(this.toolID);
  };

  ToolManager.prototype.unsetEventHandlersForTool = function(id) {
    var entries = Object.entries(this.tools[id].eventHandlers.mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      this.mouse.off(this.canvas, key, value.handler, value.props);
    }
  };

  ToolManager.prototype.setEventHandlersForTool = function(id) {
    var entries = Object.entries(this.tools[id].eventHandlers.mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      this.mouse.on(this.canvas, key, value.handler, value.props);
    }
  };

  return {
    getInstance: function() {
      if (!instance) {
        instance = new ToolManager();
      }
      return instance;
    }
  };
})();
