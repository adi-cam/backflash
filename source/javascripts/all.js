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
  });

  // map movies to events using the eventid and id properties
  movies.forEach(function(m){
    m._event = events.filter(function(e){
      return e.id == m.eventid;
    })[0];

  });
  console.log(movies);


  var genres = [];
  movies.forEach(function(m){
    genres.push(m.genre);
  });

  var countries =[]
  movies.forEach(function(m){
    countries.push(m.country);
  });


  var unique = function(d) {
    var uniqueArr= [],
        origLen = d.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
      found = undefined;
      for (y = 0; y < uniqueArr.length; y++) {
        if (d[x] === uniqueArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        uniqueArr.push(d[x]);
      }
    }
    return uniqueArr;
  }
  var uniqueGenres = unique(genres);
  console.log(uniqueGenres);

  var uniqueCountries = unique(countries);
  console.log(uniqueCountries);



  //create timescale
  var xScale = d3.scale.linear().domain([1, 31]).range([0, 1000]);
  var yScale = d3.scale.linear().domain([0, 8]).range([0, 1000]);

  // create color scale
  var colorScaleGenre = d3.scale.category10([uniqueGenres]);
  var colorScaleCountry = d3.scale.category10([uniqueCountries]);

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
      return (xScale(d._event._date.getDate()));
    })
    .attr('cy', function(d, i) {
        return (yScale(d._event._date.getMonth()));
      })
    //.style('fill', function (d) {return colorScaleCountry(d.genre)});
    .style('fill', function (d) {return colorScaleGenre(d.country)});

  items.exit().remove();
}

