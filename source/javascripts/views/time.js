/**
 * Local namespace for time view.
 */
bf.timeView = {};

/**
 * YKeys for the vertical distribution of months.
 */
bf.timeView.yKeys = [];

/**
 * All the scales.
 */
bf.timeView.radiusScale = undefined;
bf.timeView.yRangeScale = undefined;
bf.timeView.yScale = undefined;
bf.timeView.colorScaleGenre = undefined;
bf.timeView.colorScaleCountry = undefined;
bf.timeView.opacityScale = undefined;
bf.timeView.yearScale = undefined;

/**
 * Prepare stuff needed for this view.
 */
bf.timeView.prepare = function(){
  // generate yKeys
  bf.events.forEach(function(e){
    var paddedMonth = ('0' + e._date.getMonth()).slice(-2);
    e._tv_yKey = parseInt(e._date.getFullYear() + '' + paddedMonth);
  });

  // collect all yKeys
  var yks = [];
  bf.movies.forEach(function(m){
    yks.push(m._event._tv_yKey);
  });

  bf.timeView.yKeys = _.uniq(yks).sort().reverse();

  //create location scales
  var maxRuntime = d3.max(bf.movies, function(m){ return m.length });
  bf.timeView.radiusScale = d3.scale.sqrt().domain([0, maxRuntime]).range([0, 50]);

  bf.timeView.yRangeScale = d3.scale.ordinal().domain(bf.timeView.yKeys).rangeRoundPoints([0, bf.timeView.yKeys.length-1]);
  bf.timeView.yScale = d3.scale.linear().domain([0, bf.timeView.yKeys.length-1]).range([0, 900]);

  // create color scale
  bf.timeView.colorScaleGenre = d3.scale.category20(bf.genres);
  bf.timeView.colorScaleCountry = d3.scale.category20(bf.regions);

  // get min and max from year
  var extentYear = d3.extent(bf.movies, function(m){ return m.year; });

  // create opacity scale
  bf.timeView.opacityScale = d3.scale.linear().domain(extentYear).range([0, 1]);

  // create blur scale
  bf.timeView.yearScale = d3.scale.linear().domain(extentYear).range([15, 0]);
};

bf.timeView.draw = function(){
  // prepare the tooltip div
  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 50);

  var items = d3.select('svg')
    .selectAll('.movie')
    .data(bf.movies, function(m) {
      return m.id;
    });

  items.enter()
    .append('g')
    .attr('class', 'movie')
    .attr('data-id', function(d) {
      return d.id;
    })
    .append('circle')
      .attr('class', 'movie')
      .on('mouseover', function (d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html(d.title + ' ' + d._region + ' ' + d.genre + ' ' + d.year + ' ' + d._event._date)
          .style('left', (d3.event.pageX - 20) + "px")
          .style('top', (d3.event.pageY - 40) + "px");
      });

  // create array for months (9x0)
  var xPositions = d3.range(bf.timeView.yKeys.length).map(function(){ return 1; });

  items.attr("transform", function(d) {
    var m2 = bf.timeView.yRangeScale(d._event._tv_yKey);
    var x = xPositions[m2];
    var r = bf.timeView.radiusScale(d.length);
    xPositions[m2] += r * 2 + 20;
    return "translate (" + ((x + r) + 50) + "," + ((bf.timeView.yScale(m2)) + 50) + ")";
  });

  items.select('circle')
    .attr('r', function (d) {
      return bf.timeView.radiusScale(d.length);
    })
    // .style('fill-opacity', function (d) {return bf.timeView.opacityScale(d.year)})
    .style('fill', function (d) {
      return bf.timeView.colorScaleCountry(d._region);
      // return bf.timeView.colorScaleGenre(d.genre);
    });

  var labels = d3.select('svg')
    .selectAll('.label')
    .data(bf.timeView.yKeys)
    .enter()
    .append('text')
    .html(function(d){ return d; })
    .attr('class', 'label')
    .attr('x', 0)
    .attr('y', function(d){
      return bf.timeView.yScale(bf.timeView.yRangeScale(d));
    });
};


//TODO: Parse numbers to names in labels
//TODO: take widow size instead of fixed dimensions
//TODO: Define own colors!
//TODO: Try saturation instead of opacity or blur
//TODO: Clean out dataset of x's (optional)
//TODO: Make tooltip better (optional)
