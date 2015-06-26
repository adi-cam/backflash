bf.svg = undefined;
bf.nodes = undefined;

// YKeys for the vertical distribution of months.
bf.yKeys = undefined;
bf.labels = undefined;

//All the scales.
bf.radiusScale = undefined;
bf.yRangeScale = undefined;
bf.yScale = undefined;
bf.colorScaleGenre = undefined;
bf.colorScaleCountry = undefined;
bf.opacityScale = undefined;
bf.blurScale = undefined;
bf.colorsRGB = undefined;

//colors
bf.colorsRGB = undefined;
bf.colorScaleH = undefined;
bf.colorScaleS = undefined;
bf.colorScaleL = undefined;
bf.Sminus = undefined;


bf.prepare = function(){
  var width = $(window).width();
  var height = $(window).height();

   /*
   Global Scales Color and Size
   */
  //Size scale
  var maxRuntime = d3.max(bf.movies, function(m){ return m.length });
  bf.radiusScale = d3.scale.sqrt().domain([0, maxRuntime]).range([0, 50]);

  //RGB and HSL color matrix
  bf.colorsRGB = ['#DC1F26', '#00A89B', '#EE5325', '#EC1263', '#00B04E', '#FFED2B', '#009AD7', '#17479E'];
  var hsl =[];
  for (i= 0; i<=bf.colorsRGB.length; i++){hsl.push(d3.rgb(bf.colorsRGB[i]).hsl());};

  //color scale for genre and year
  bf.colorScaleH = d3.scale.ordinal().domain(bf.genres).range([hsl[0].h, hsl[1].h, hsl[2].h, hsl[3].h, hsl[4].h, hsl[5].h, hsl[6].h, hsl[7].h]);
  bf.colorScaleS = d3.scale.ordinal().domain(bf.genres).range([hsl[0].s, hsl[1].s, hsl[2].s, hsl[3].s, hsl[4].s, hsl[5].s, hsl[6].s, hsl[7].s]);
  bf.colorScaleL = d3.scale.ordinal().domain(bf.genres).range([hsl[0].l, hsl[1].l, hsl[2].l, hsl[3].l, hsl[4].l, hsl[5].l, hsl[6].l, hsl[7].l]);

  bf.Sminus = d3.scale.ordinal().domain(bf.years).range([43, 0]);

  //color scale for genre or country
  bf.colorScaleGenre = d3.scale.ordinal().domain(bf.genres).range(bf.colorsRGB);
  bf.colorScaleCountry = d3.scale.ordinal().domain(bf.regions).range(bf.colorsRGB);

  //opacity scale for year
  var extentYear = d3.extent(bf.movies, function(m){ return m.year; });
  bf.opacityScale = d3.scale.linear().domain(extentYear).range([0.2, 1]);
  console.log(extentYear);

  //blur scale for year
  bf.blurScale = d3.scale.linear().domain(extentYear).range([30, 0]);

  /*
   Global Scales Position
   */
  //generate yKeys
  bf.events.forEach(function(e){
    var paddedMonth = ('0' + e._date.getMonth()).slice(-2);
    e._tv_yKey = parseInt(e._date.getFullYear() + '' + paddedMonth); });

  //collect all yKeys
  var yks = [];
  bf.movies.forEach(function(m){
    yks.push(m._event._tv_yKey); });

  //get all unique yKeys from the array, sort the yKeys and reverse their order
  bf.yKeys = _.uniq(yks).sort().reverse();

  //create position scales
  bf.yRangeScale = d3.scale.ordinal().domain(bf.yKeys).rangeRoundPoints([0, bf.yKeys.length-1]);
  bf.yScale = d3.scale.linear().domain([0, bf.yKeys.length-1]).range([0, 900]);
  bf.xPositions = d3.range(bf.yKeys.length).map(function(){ return 1; });

  /*
   Prepare SVG and data
   */
  //find svg
  bf.svg = d3.select('svg.main');


  //set initial size
  bf.svg.attr({
    width:width,
    height: height
  });

  //link to data
  bf.nodes = bf.svg.selectAll('.movie')
    .data(bf.movies, function(m) {
      return m.id;
    });

  //create g Elements
  var newNodes = bf.nodes.enter().append('g');

  //with the class 'movie' and a unique id. set initial position
  newNodes
    .attr('class', 'movie')
    .attr('data-id', function(d) {
      return d.id;
    });


  //set position
  bf.nodes.attr('transform', function(d) {
    var m2 = bf.yRangeScale(d._event._tv_yKey);
    var x = bf.xPositions[m2];
    var r = bf.radiusScale(d.length);
    bf.xPositions[m2] += r * 2 + 20;
    d.x = x + r + 50;
    d.y = bf.yScale(m2) + 60;
    return "translate (" + d.x + "," + d.y + ")";
  });

  /*
  Prepare Tooltip
   */
  var tooltip = d3.select('.tooltip');
  var tarrow = d3.select('.tooltip.arrow');

  //call tooltip
  bf.nodes
    .on('mouseover', function (d) {
      tooltip.style('visibility', 'visible');
      tooltip.html('<strong>' + d.title +'</strong>' + '</br> ' + d.director + ', ' + d.year)
        .style('line-height', 1.3)
        .style('left', (d.x-60) + 'px')
        .style('top', (d.y+40) + 'px');
      tarrow.style('top', -60+'px');
      return d3.select(this).style({opacity:'0.8'})
    .on('mouseout', function(d){
      return d3.select(this).style({opacity:'1'})
    })
    });
  bf.svg.on('mouseleave', function(d){
    tooltip.style('visibility', 'hidden');
  });



  //Blur Filter
  var filter = newNodes.append('defs')
    .append('filter')
    .attr('id', 'feGaussianBlur')
    .attr('x', '-200%')
    .attr('y', '-200%')
    .attr('width', '500%')
    .attr('height', '500%')
    .append('feGaussianBlur')
    .attr('class', 'gaussianblur')
    .attr('stdDeviation', function (d) {
    return bf.blurScale(d.year); })
    .attr('result', 'blur');

  var feMerge = newNodes.select('defs filter')
    .append('feMerge');

  feMerge.append('feMergeNode')
    .attr('in', 'blur');

  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');

  newNodes.append('circle')
    .style('filter', 'url(#feGaussianBlur)');

};
