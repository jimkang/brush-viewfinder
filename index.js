var createArrayViewFinder = require('array-viewfinder');
var range = require('d3-arrays').range;
var d3 = require('d3-selection');
var renderBrushies = require('./brushies');
var probable = require('probable');

var viewfinder = createArrayViewFinder({
  array: generateNewElements(100, 0),
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

function addToViewfinder() {
  var array = viewfinder.getWholeArray();
  var howMany = probable.rollDie(10) + 5;
  var startingValue = array[array.length - 1];

  var prependNewElements = (probable.roll(2) === 0);

  if (prependNewElements) {
    startingValue = array[0] - howMany;
  }
  var newElements = generateNewElements(howMany, startingValue);
  if (prependNewElements) {
    array = newElements.concat(array);
  }
  else {
    array = array.concat(newElements);
  }
  viewfinder.update(array);

  renderBrushies(viewfinder, syncElementsToView);
}

setInterval(addToViewfinder, 2000);

function generateNewElements(howMany, startingValue) {
  var newElements = [];
  for (var i = 0; i < howMany; ++i) {
    newElements.push(newElementForBase(startingValue + i));
  }
  return newElements;
}

function newElementForBase(baseValue) {
  // For now.
  return baseValue;
}
