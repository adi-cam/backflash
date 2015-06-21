/**
 * Local namespace for time view.
 */
bf.timeView = {};

/**
 * YKeys for the vertical distribution of months.
 */
bf.timeView.yKeys = [];
bf.timeView.labels = undefined;

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
bf.timeView.color = undefined;
bf.timeView.colorScale = undefined;
bf.timeView.yearScaleSmall = undefined;

/**
 * colors
 */
bf.timeView.colorsHSL = undefined;
bf.timeView.colorsRGB = undefined;
bf.timeView.colorScaleH = undefined;
bf.timeView.colorScaleS = undefined;
bf.timeView.colorScaleL = undefined;
bf.timeView.Sminus = undefined;
hsl = undefined;


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

  //get all unique yKeys from the array, sort the yKeys and reverse their order
  bf.timeView.yKeys = _.uniq(yks).sort().reverse();

  //map yKeys to words for labels
  bf.timeView.labels = d3.scale.ordinal().domain(bf.timeView.yKeys).range(['Mai, 2015', 'April, 2015', 'März, 2015', 'February, 2015',
    'Dezember, 2014', 'November, 2014', 'Oktober, 2014', 'September, 2014']);

  //create location scales
  var maxRuntime = d3.max(bf.movies, function(m){ return m.length });
  bf.timeView.radiusScale = d3.scale.sqrt().domain([0, maxRuntime]).range([0, 50]);

  bf.timeView.yRangeScale = d3.scale.ordinal().domain(bf.timeView.yKeys).rangeRoundPoints([0, bf.timeView.yKeys.length-1]);
  bf.timeView.yScale = d3.scale.linear().domain([0, bf.timeView.yKeys.length-1]).range([0, 900]);

  //Prepare RGB and HSL color matrix
  bf.timeView.colorsRGB = ['#DC1F26', '#00A89B', '#EE5325', '#EC1263', '#00B04E', '#FFED2B', '#009AD7', '#17479E'];

  var hsl =[];
  for (i= 0; i<=bf.timeView.colorsRGB.length; i++){hsl.push(d3.rgb(bf.timeView.colorsRGB[i]).hsl());};

  // create color scale for genre or country
  bf.timeView.colorScaleGenre = d3.scale.ordinal().domain(bf.genres).range(bf.timeView.colorsRGB);
  bf.timeView.colorScaleCountry = d3.scale.ordinal().domain(bf.regions).range(bf.timeView.colorsRGB);

  //create color scale for genre and year
  bf.timeView.colorScaleH = d3.scale.ordinal().domain(bf.genres).range([hsl[0].h, hsl[1].h, hsl[2].h, hsl[3].h,
    hsl[4].h, hsl[5].h, hsl[6].h, hsl[7].h]);
  bf.timeView.colorScaleS = d3.scale.ordinal().domain(bf.genres).range([hsl[0].s, hsl[1].s, hsl[2].s, hsl[3].s,
    hsl[4].s, hsl[5].s, hsl[6].s, hsl[7].s]);
  bf.timeView.colorScaleL = d3.scale.ordinal().domain(bf.genres).range([hsl[0].l, hsl[1].l, hsl[2].l, hsl[3].l,
    hsl[4].l, hsl[5].l, hsl[6].l, hsl[7].l]);

  bf.timeView.Sminus = d3.scale.ordinal().domain(bf.years).range([43, 0]);

  // create opacity scale for year
  var extentYear = d3.extent(bf.movies, function(m){ return m.year; });
  bf.timeView.opacityScale = d3.scale.linear().domain(extentYear).range([0.2, 1]);

  // create blur scale for year
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
        div.html(d.title + ' ' + d._region + ' ' + d.genre + ' ' + d.year)
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
    return "translate (" + ((x + r) + 50) + "," + ((bf.timeView.yScale(m2)) + 60) + ")";
  });

  //Blur Filter
  var filter = items.append("defs")
    .append("filter")
    .attr("id", "feGaussianBlur")
    .attr('x', "-200%")
    .attr('y', "-200%")
    .attr('width', "500%")
    .attr('height', "500%")
    .append("feGaussianBlur")
    .attr("stdDeviation", function (d) {
      return bf.timeView.yearScale(d.year);
    })
    .attr("result", "blur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
    .attr("in", "blur");
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

  items.select('circle')
    .attr('r', function (d) {
      return bf.timeView.radiusScale(d.length);
    })
    .style("filter", "url(#feGaussianBlur)")
    //.style('fill-opacity', function (d) {return bf.timeView.opacityScale(d.year)})
    .style('fill', function (d) {
      //return bf.timeView.colorScaleCountry(d._region);
      return bf.timeView.colorScaleGenre(d.genre);
      //return 'hsl('+(bf.timeView.colorScaleH(d.genre))+', 80%, '+ (60 - (bf.timeView.Sminus(d.year))) +'%)'
    })
    .style('fill', function(d){
    return bf.timeView.colorScaleS(d.year)
    });

  var labels = d3.select('svg')
    .selectAll('.label')
    .data(bf.timeView.yKeys)
    .enter()
    .append('text')
    .html(function(d){ return bf.timeView.labels(d); })
    .attr('class', 'label')
    .attr('x', 20)
    .attr('y', function(d){
      return (bf.timeView.yScale(bf.timeView.yRangeScale(d)))+15;
    });
};

//TODO: Try saturation instead of opacity or blur
//TODO: Parse numbers to names in labels
//TODO: take widow size instead of fixed dimensions
//TODO: Clean out dataset of x's (optional)
//TODO: Make tooltip better (optional)
