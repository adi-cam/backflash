//= require_self

d3.json('data.json', function(_, data) {
  dataViz(data);
});

function dataViz(data) {
  var movies = data.movies;
  var events = data.events;

  // convert string date to date objet and save as _date on event object
  // extract month from previously created date object and save as _month on object
  events.forEach(function(e) {
    var timeFormat = d3.time.format('%d.%m.%Y');
    e._date = timeFormat.parse(e.date);
    e._month = e._date.getMonth();
  });

  // map movies to events using the eventid and id properties
  movies.forEach(function(m){
    m._event = events.filter(function(e){
      return e.id == m.eventid;
    })[0];
  });

  // map events to movies using the id and and eventid properties
  events.forEach(function(e){
    e._movies = movies.filter(function(m){
      return m.eventid == e.id;
    });
  });
  console.log(events);

  var nestedEvents = d3.nest()
      .key(function(e) {
        return e._month
      })
      .entries(events);
  console.log(nestedEvents);


  //create timescale
  var timeScale = d3.time.scale().domain([events[0]._date, events[events.length-1]._date]).range([0, 400]);

  // create color scale
  var tenColorScale = d3.scale.category10([movies.genre]);


  var items = d3.select('.graph')
    .selectAll('.movie')
    .data(movies, function(m){
      return m.id;
    });

  items.enter().append('circle')
    .attr('class', 'movie')
    .attr('r', function(d){
      return (d.length) / 3;
    })
    .attr('data-id', function(d){
      return d.id;
    })
    .attr("cx", function(d, i){
      return i * (timeScale(d._event._date));
    })
    .attr('cy', 200)
    .style('fill', function (d) {return tenColorScale(d.genre)});

  items.exit().remove();
}

