//= require_self

d3.json('data.json', function(_, data) {
  dataViz(data);
});


function dataViz(data) {
  var m = data.movies;
  var e = data.events;

  //format dates
  var date = [];

  e.forEach(function (d, i) {
    var timeFormat = d3.time.format('%d.%m.%Y');
    d.date = timeFormat.parse(d.date);
    date.push(d.date);
  });
  console.log(date);


  //get month
  var month = [];
  e.forEach(function (d, i) {
    d.date = date[i].getMonth();
    month.push(d.date + 1)
  });
  console.log(month);


  //consolidate datapoints under eventid
  var key = e.id;
  var keyMovies = m.eventid;
  var group = [];

  if (key==keyMovies) {
    //group.push(d3.merge([m, e]))
    var nest = d3.nest()
        .key(function (d) {
           return key
        })
        .key (function(d){
          return keyMovies
        })
        .entries(data);

    }
   console.log(nest);

  //create timescale
  var timeScale =  d3.time.scale().domain([date[0], date[date.length-1]]).range([0, 1000]);
  console.log(timeScale(date[6]));


  var tenColorScale = d3.scale.category10(['documentary', 'sci.fi_fiction', 'drama_romance']);

  var items = d3.select('.graph').selectAll('.movie').data(m, function(d){
    return d.id;
  });

  items.enter().append('circle')
    .attr('class', 'movie')
    .attr('r', function(d){
      return (d.length || 5) / 5;
    })
    .attr('data-id', function(d){
      return d.id;
    })
      .attr("cx", function(_, i){
        return (i/2)* (timeScale(date[i]));
      })
      .attr('cy', 200)
      .style('fill', function (d) {return tenColorScale(d.genre)});

  items.exit().remove();
}

