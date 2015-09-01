var createArrayViewFinder = require('array-viewfinder');
var range = require('d3-arrays').range;
var d3 = require('d3-selection');
var renderBrushies = require('./brushies');

var viewfinder = createArrayViewFinder({
  array: range(0, 100, 1),
  viewSize: 10,
  valueEqualityFn: simpleEq
});

var root = d3.select('#array-element-root');

renderBrushies(viewfinder, syncElementsToView);

syncElementsToView();

function simpleEq(a, b) {
  return a === b;
}

function passThrough(d) {
  return d;
}

function syncElementsToView() {
  var update = root.selectAll('.array-element').data(viewfinder.view());
  update.enter().append('div').class('array-element', true)
  update.text(passThrough);
  update.exit().remove();  
}
