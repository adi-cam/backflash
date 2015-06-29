bf.timeView = {};
bf.timeView.labels = undefined;


bf.timeView.prepare = function(){
  //map yKeys to words for labels
  bf.timeView.labels = d3.scale.ordinal().domain(bf.yKeys).range(['Mai, 2015', 'April, 2015', 'März, 2015', 'February, 2015', 'Dezember, 2014', 'November, 2014', 'Oktober, 2014', 'September, 2014']);
//create position scales

};


bf.timeView.draw = function(){

  bf.button = d3.select('.button');

  bf.elements.transition().duration(1000).select('circle')
    .attr('r', function (d) {
      return bf.radiusScale(d.length); })
  .style('fill', function (d) { return 'hsl('+(bf.colorScaleH(d.genre))+', 100%, '+ (60 - (bf.Sminus(d.year))) +'%)';});

  bf.button
    .on('mouseenter', function(d){
          bf.elements.select('circle').style('fill', function (d) { return 'hsl('+(bf.colorScaleH2(d._region))+', 100%, '+ (60 - (bf.Sminus(d.year))) +'%)';});
      })
        .on('mouseout', function(d){
      bf.elements.select('circle').style('fill', function (d) { return 'hsl('+(bf.colorScaleH(d.genre))+', 100%, '+ (60 - (bf.Sminus(d.year))) +'%)';});
    });

console.log(bf.colorScaleH2('home'));
  console.log(bf.colorScaleH2('westEurope'));
  console.log(bf.elements)


  bf.yRangeScale = d3.scale.ordinal().domain(bf.yKeys).rangeRoundPoints([0, bf.yKeys.length-1]);
  bf.yScale = d3.scale.linear().domain([0, bf.yKeys.length-1]).range([0, 900]);
  bf.xPositions = d3.range(bf.yKeys.length).map(function(){ return 1; });

  bf.elements.transition().duration(1000).attr('transform', function(d) {
    var m2 = bf.yRangeScale(d._event._tv_yKey);
    var x = bf.xPositions[m2];
    var r = bf.radiusScale(d.length);
    bf.xPositions[m2] += r * 2 + 20;
    d.x = x + r + 50;
    d.y = bf.yScale(m2) + 210;
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
          return (bf.yScale(bf.yRangeScale(d)))+ 160; });


};

bf.timeView.clear = function(){
  bf.svg.selectAll('.label').remove();
};
