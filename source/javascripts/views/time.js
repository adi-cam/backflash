bf.timeView = {};
bf.timeView.labels = undefined;


bf.timeView.prepare = function(){
  //map yKeys to words for labels
  bf.timeView.labels = d3.scale.ordinal().domain(bf.yKeys).range(['Mai, 2015', 'April, 2015', 'März, 2015', 'February, 2015', 'Dezember, 2014', 'November, 2014', 'Oktober, 2014', 'September, 2014']);
};


bf.timeView.draw = function(){
  bf.nodes.select('.gaussianblur')
    .attr('stdDeviation', function (d) {
      return bf.blurScale(d.year);
    });

  bf.nodes.select('circle')
    .attr('r', function (d) {
      return bf.radiusScale(d.length); })
    //.style('fill-opacity', function (d) {return bf.opacityScale(d.year)})
    .style('fill', function (d) {
      return bf.colorScaleGenre(d.genre);
      //return 'hsl('+(bf.colorScaleH(d.genre))+', 80%, '+ (60 - (bf.timeView.Sminus(d.year))) +'%)'
      //return bf.colorScaleCountry(d._region);
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
//TODO: Make tooltip better (optional)
