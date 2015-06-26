bf.timeView = {};
bf.timeView.labels = undefined;


bf.timeView.prepare = function(){
  //map yKeys to words for labels
  bf.timeView.labels = d3.scale.ordinal().domain(bf.yKeys).range(['Mai, 2015', 'April, 2015', 'März, 2015', 'February, 2015', 'Dezember, 2014', 'November, 2014', 'Oktober, 2014', 'September, 2014']);
//create position scales

};


bf.timeView.draw = function(){

  bf.nodes.transition().duration(1000).select('circle')
    .attr('r', function (d) {
      return bf.radiusScale(d.length); })
    //.style('fill-opacity', function (d) {return bf.opacityScale(d.year)})
    .style('fill', function (d) {
      return bf.colorScaleGenre(d.genre);
      //return 'hsl('+(bf.colorScaleH(d.genre))+', 80%, '+ (60 - (bf.timeView.Sminus(d.year))) +'%)'
      //return bf.colorScaleCountry(d._region);
    });
  bf.yRangeScale = d3.scale.ordinal().domain(bf.yKeys).rangeRoundPoints([0, bf.yKeys.length-1]);
  bf.yScale = d3.scale.linear().domain([0, bf.yKeys.length-1]).range([0, 900]);
  bf.xPositions = d3.range(bf.yKeys.length).map(function(){ return 1; });

  bf.nodes.transition().duration(1000).attr('transform', function(d) {
    var m2 = bf.yRangeScale(d._event._tv_yKey);
    var x = bf.xPositions[m2];
    var r = bf.radiusScale(d.length);
    bf.xPositions[m2] += r * 2 + 20;
    d.x = x + r + 50;
    d.y = bf.yScale(m2) + 60;
    return "translate (" + d.x + "," + d.y + ")";
  });

  bf.svg.selectAll('.label')
    .data(bf.yKeys)
    .enter()
      .append('text')
        .html(function(d){ return bf.timeView.labels(d); })
        .attr('class', 'label')
        .attr('x', 20)
        .attr('y', function(d){
          return (bf.yScale(bf.yRangeScale(d)))+15; });


};

bf.timeView.clear = function(){
  bf.svg.selectAll('.label').remove();
};



//TODO: Clean out dataset of x's (optional)
//TODO: Call tooltip better
