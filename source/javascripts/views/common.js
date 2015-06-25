bf.svg = undefined;
bf.nodes = undefined;

bf.prepare = function(){
  var width = $(window).width();
  var height = $(window).height();

  // TODO: create element in html and style with css
  // prepare the tooltip div
  var div = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 50);

  // find svg
  bf.svg = d3.select('svg.main');

  // set initial size
  bf.svg.attr({
    width:width,
    height: height
  });

  // link to data
  bf.nodes = bf.svg.selectAll('.movie')
    .data(bf.movies, function(m) {
      return m.id;
    });

  var newNodes = bf.nodes.enter().append('g');

  newNodes
    .attr('class', 'movie')
    .attr('data-id', function(d) {
      return d.id;
    })
    .attr('transform', 'translate(0, 0)'); // use this to position node
    //.on('mouseover', function (d) {
    //  div.transition()
    //    .duration(500)
    //    .style('opacity', 0);
    //  div.transition()
    //    .duration(200)
    //    .style('opacity', .9);
    //  div.html(d.title + ' ' + d._region + ' ' + d.genre + ' ' + d.year)
    //    .style('left', (d3.event.pageX - 20) + 'px')
    //    .style('top', (d3.event.pageY - 40) + 'px');
    //});

  newNodes.append('circle')
    .attr('class', 'movie')
    .style('filter', 'url(#feGaussianBlur)');

  //Blur Filter
  newNodes.append('defs')
    .append('filter')
    .attr('id', 'feGaussianBlur')
    .attr('x', '-200%')
    .attr('y', '-200%')
    .attr('width', '500%')
    .attr('height', '500%')
    .append('feGaussianBlur')
    .attr('class', 'blur')
    .attr('stdDeviation', 0)
    .attr('result', 'blur');

  var feMerge = newNodes.select('defs filter')
    .append('feMerge');

  feMerge.append('feMergeNode')
    .attr('in', 'blur');

  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');
};
