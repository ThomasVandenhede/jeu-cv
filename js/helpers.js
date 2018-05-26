function toFixedPrecision(number, precision) {
  return +number.toFixed(precision);
}

function noop() {}

function randInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}
