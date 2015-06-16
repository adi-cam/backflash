//= require_self

d3.json('data.json', function(_, data) {
  dataViz(data);
});

function dataViz(data) {
  var items = d3.select('.graph').selectAll('.point').data(data.movies);

  items.enter().append('circle')
    .attr('class', 'point')
    .attr('r', function(d){
      return d.length / 10;
    })
    .attr('cx', function(_, i){
      return i * 30 + 10;
    })
    .attr('cy', 200);

  items.exit().remove();
}
