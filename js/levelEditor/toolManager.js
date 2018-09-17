class ToolManager {
  constructor(props) {
    if (!ToolManager.instance) {
      ToolManager.instance = this;
    }
    this.tools = props.tools;
    this.mouse = props.mouse;
    this.canvas = props.canvas;
    this.toolID = 0;
    this.setEventHandlersForTool(this.toolID);
    return ToolManager.instance;
  }

  get tool() {
    return this.toolID;
  }

  set tool(id) {
    if (id !== this.toolID) {
      this.unsetEventHandlersForTool(this.toolID);
      this.setEventHandlersForTool(id);
      this.toolID = id;
    }
  }

  unsetEventHandlersForTool(id) {
    var entries = Object.entries(this.tools[id].eventHandlers.mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      this.mouse.off(this.canvas, key, value.handler, value.props);
    }
  }

  setEventHandlersForTool(id) {
    var entries = Object.entries(this.tools[id].eventHandlers.mouse);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      this.mouse.on(this.canvas, key, value.handler, value.props);
    }
  }
}
