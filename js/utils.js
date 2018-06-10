function toFixedPrecision(number, precision) {
  var precision = precision || 0;
  return +number.toFixed(precision);
}

function noop() {}

function randInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
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

function e(type, props, children) {
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
      node = document.createTextNode(nodes[i])
    } else {
      node = nodes[i];
    }
    el.appendChild(node);
  }
  return el;
}

function emptyElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}