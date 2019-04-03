module.exports = {
  toFixedPrecision: function(number, precision) {
    return +number.toFixed(precision || 0);
  },

  noop: function() {},

  randInt: function(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
  },

  lerp: function(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  },

  show: function(el) {
    el.classList.remove("hidden");
  },

  hide: function(el) {
    el.classList.add("hidden");
  },

  incrementID: (function() {
    var id = -1;
    return function() {
      id = id + 1;
      return id;
    };
  })(),

  // h: function(type, props, children) {
  //   var el = document.createElement(type);
  //   var nodes, node;
  //   for (var key in props) {
  //     el.setAttribute(key, props[key]);
  //   }
  //   if (Array.isArray(children)) {
  //     nodes = children;
  //   } else {
  //     nodes = [children];
  //   }
  //   for (var i = 0; i < nodes.length; i++) {
  //     if (typeof nodes[i] === "string") {
  //       node = document.createTextNode(nodes[i]);
  //     } else {
  //       node = nodes[i];
  //     }
  //     el.appendChild(node);
  //   }
  //   return el;
  // },

  render: function(vdom) {
    return (function renderNode(vnode) {
      // vnode is a string
      if (typeof vnode === "string" || typeof vnode === "number")
        return document.createTextNode(vnode);

      const element = document.createElement(vnode.type);
      const props = vnode.props || {};

      Object.keys(props).forEach(function(key) {
        // treat events separately
        if (typeof props[key] !== "function") {
          element.setAttribute(key, props[key]);
        }

        // events
        if (typeof props[key] === "function") {
          var eventType = key.substring(2); // remove the 'on' part
          element.addEventListener(eventType, props[key]);
        }
      });

      (vnode.children || []).forEach(function(childNode) {
        if (childNode === undefined) return;
        return element.appendChild(renderNode(childNode));
      });
      return element;
    })(vdom);
  },

  h: function() {
    var vNode = {};
    var type = arguments[0];
    var props = arguments[1];
    var children = Array.prototype.slice.call(arguments, 2);

    vNode.type = type;
    vNode.props = props;
    if (children.length) {
      vNode.children = children.reduce((acc, item) => {
        return Array.isArray(item) ? [...acc, ...item] : [...acc, item];
      }, []);
    } else {
      vNode.children = null;
    }

    return vNode;
  },

  emptyElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
};
