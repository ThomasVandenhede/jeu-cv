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
