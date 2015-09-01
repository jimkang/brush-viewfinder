var d3Arrays = require('d3-arrays');
var d3Scale = require('d3-scale');
var d3Random = require('d3-random')
var d3Svg = require('./lib/d3-small').svg;

function renderBrushies(viewfinder) {
  // var data = d3Arrays.range(800).map(Math.random);

  var margin = {top: 194, right: 50, bottom: 214, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3Scale.linear()
    .domain([0, viewfinder.getWholeArray().length])
    .range([0, width]);

  // var y = d3Random.normal(height / 2, height / 8);

  var brush = d3Svg.brush()
      .x(x)
      .extent([.3, .5])
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

  var arc = d3Svg.arc()
      .outerRadius(height / 2)
      .startAngle(0)
      .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3Svg.axis().scale(x).orient("bottom"));

  // var circle = svg.append("g").selectAll("circle")
  //     .data(data)
  //   .enter().append("circle")
  //     .attr("transform", function(d) { return "translate(" + x(d) + "," + y() + ")"; })
  //     .attr("r", 3.5);

  var brushg = svg.append("g")
      .attr("class", "brush")
      .call(brush);

  var resizers = brushg.selectAll(".resize").append('g')
      .attr("transform", "translate(0," +  height / 2 + ")");

  resizers.append("path")
      .attr("d", arc);

  var resizerLabels = resizers.append('text');
  // .text('label');
  
  brushg.selectAll("rect")
      .attr("height", height);

  brushstart();
  brushmove();

  function brushstart() {
    svg.classed("selecting", true);
    updateBrushLabels();
  }

  function brushmove() {
    var s = brush.extent();
    updateBrushLabels();
    // circle.classed("selected", function(d) { return s[0] <= d && d <= s[1]; });
  }

  function brushend() {
    svg.classed("selecting", !d3.event.target.empty());
  }

  function updateBrushLabels() {
    resizerLabels.text(getLabelTextForBrushData);
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

module.exports = renderBrushies;
