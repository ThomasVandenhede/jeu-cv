function toFixedPrecision(number, precision) {
  return +number.toFixed(precision || 0);
}

function noop() {}

function randInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

var incrementID = (function() {
  var id = -1;
  return function() {
    id = id + 1;
    return id;
  };
})();

function h(type, props, children) {
  var el = document.createElement(type);
  var nodes, node;
  for (var key in props) {
    el.setAttribute(key, props[key]);
  }
  if (Array.isArray(children)) {
    nodes = children;
  } else {
    nodes = [children];
  }
  for (var i = 0; i < nodes.length; i++) {
    if (typeof nodes[i] === "string") {
      node = document.createTextNode(nodes[i]);
    } else {
      node = nodes[i];
    }
    el.appendChild(node);
  }
  return el;
}

/**
 * Build DOM from virtual DOM tree.
 * @param {Object} vdom
 */
function render(vdom) {
  if (vdom.split) return document.createTextNode(vdom);

  const element = document.createElement(vdom.type);
  const props = vdom.props || {};

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

  (vdom.children || []).forEach(function(vNode) {
    return element.appendChild(render(vNode));
  });
  return element;
}

function h() {
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
}

function emptyElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
