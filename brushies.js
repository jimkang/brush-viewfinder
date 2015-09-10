var d3Scale = require('d3-scale');
var d3Random = require('d3-random')
var d3Svg = require('./lib/d3-small').svg;

var margin = {
  top: 194,
  right: 50,
  bottom: 214,
  left: 50
};

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var brush;
var svg;
var axisGroup;
var brushg;
var resizerLabels;

var arc = d3Svg.arc()
    .outerRadius(height / 2)
    .startAngle(0)
    .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

function renderBrushies(viewfinder, syncElementsToView) {
  var array = viewfinder.getWholeArray();

  var x = getXScale(array);

  if (!brush) {
    brush = d3Svg.brush()
      .x(x)
      .extent([.3, .5])
      .on('brushstart', brushstart)
      .on('brush', brushmove)
      .on('brushend', brushend);
  }

  if (!svg) {
    svg = d3.select('#brush-root').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    brushg = svg.append('g')
        .attr('class', 'brush')
        .call(brush);

    var resizers = brushg.selectAll('.resize').append('g')
        .attr('transform', 'translate(0,' +  height / 2 + ')');

    resizers.append('path').attr('d', arc);

    resizerLabels = resizers.append('text');
    
    brushg.selectAll('rect')
        .attr('height', height);
  }
  else {
    brushg.call(brush);
  }

  updateBrush();

  if (!axisGroup) {
    axisGroup = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');
  }
  axisGroup.call(d3Svg.axis().scale(x).orient('bottom'));

  function brushstart() {
    svg.classed('selecting', true);
    updateBrush();
  }

  function brushmove() {
    updateBrush();
    updateViewfinder();
    syncElementsToView();
    // circle.classed('selected', function(d) { return s[0] <= d && d <= s[1]; });
  }

  function brushend() {
    svg.classed('selecting', !d3.event.target.empty());
  }

  function updateBrush() {
    resizerLabels.text(getLabelTextForBrushData);
  }

  function updateViewfinder() {
    var extent = brush.extent();
    viewfinder.shift(extent[0] - viewfinder.getIndex());
    viewfinder.resizeView(extent[1] - extent[0]);    
  }

  function getLabelTextForBrushData(d) {
    var text = '';

    if (viewfinder.getViewSize() > 0) {
      var view = viewfinder.view();

      if (d === 'w') {
        text = view[0];
      }
      else if (d === 'e') {
        text = view[view.length - 1];
      }
    }
    return text;
  }
}

function getXScale(array) {
  return d3Scale.linear()
    .domain([array[0], array[array.length - 1]])
    .range([0, width]);
}

module.exports = renderBrushies;
