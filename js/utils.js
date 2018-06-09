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
  console.log("​e -> type", type);
  console.log("​e -> props", props);
  console.log("​e -> children", children);
  var el = document.createElement(type);
  for (var key in props) {
    el.setAttribute(key, props[key]);
  }
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      el.append(children[i]);
    }
  } else {
    el.append(children);
  }
  return el;
}
