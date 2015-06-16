//= require_self

d3.json('data.json', function(_, data) {
  dataViz(data);
});

function dataViz(data) {
  var items = d3.select('.graph').selectAll('.movie').data(data.movies, function(d){
    return d.id;
  });

  items.enter().append('circle')
    .attr('class', 'movie')
    .attr('r', function(d){
      return (d.length || 5) / 10;
    })
    .attr('data-id', function(d){
      return d.id;
    })
    .attr('cx', function(_, i){
      return i * 30 + 10;
    })
    .attr('cy', 200);

  items.exit().remove();
}

