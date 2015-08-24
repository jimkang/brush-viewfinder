var createArrayViewFinder = require('array-viewfinder');
var range = require('d3-arrays').range;
var d3 = require('d3-selection');
var renderBrushies = require('./brushies');

var viewFinder = createArrayViewFinder({
  array: range(0, 100, 1),
  viewSize: 10,
  valueEqualityFn: simpleEq
});

var root = d3.select('#array-element-root');
var update = root.selectAll('.array-element').data(viewFinder.view());
update.enter().append('div').class('array-element', true).text(passThrough);
update.exit().remove();

renderBrushies();

function simpleEq(a, b) {
  return a === b;
}

function passThrough(d) {
  return d;
}
