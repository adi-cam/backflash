//= require_self

d3.json('data.json', function(_, data) {
  dataViz(data);
});




//d3.time.scale.domain([timeFormat.parse('01.02.2002'), timeFormat.parse('01.02.2002')])

function dataViz(data) {
  var m = data.movies;
  var e = data.events;

  console.log(data);


  var date = [];

  e.forEach(function(d, i) {
    var timeFormat = d3.time.format('%d.%m.%Y');
    d.date = timeFormat.parse(d.date);
    date.push(d.date);
  });


  var timeScale =  d3.time.scale().domain([date[1], date[20]]);
  console.log(timeScale(date[6]));

  var items = d3.select('.graph').selectAll('.movie').data(m, function(d){
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

