//= require_self

$(function() {
  d3.json('data.json', function(_, data) {
    dataViz(data);
  });
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

  //get genres and countries and define how many unique categories there are
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

  //find out how many movies there are in each month
  var nestedEvents = d3.nest()
      .key(function(e) {
        return e._date.getMonth();
      })
      .entries(events);
  console.log(nestedEvents);

  nestedEvents.forEach(function(d){
    console.log(d.values.length);
  });

  //create location scales
  var yScale = d3.scale.linear().domain([0, 11]).range([0, 900]);
  var radiusScale = d3.scale.sqrt().domain([0, 480]).range([0, 50]);

  //create array for months (12x0)
  var xCursors = d3.range(12).map(function() { return 0; });

  // create color scale
  var colorScaleGenre = d3.scale.category20([uniqueGenres]); //TODO: Define own colors!
  var colorScaleCountry = d3.scale.category20([uniqueCountries]); //TODO: Define Larger Country Categories

  var items = d3.select('svg')
      .selectAll('g')
      .data(movies, function(m){
      return m.id;
      })
      .enter()
      .append('g')
      .attr('data-id', function(d){
        return d.id;
      })
      .attr("transform", function(d, i){
        var m = d._event._date.getMonth();

        var x = xCursors[m];
        var r = radiusScale(d.length);
        xCursors[m] += r * 2 + 20;

        return "translate(" +
              (x + r) + "," + ( (yScale(m)))
            + ")";
      });

  items.append('circle')
    .attr('class', 'movie')
    .attr('r', function(d){
      return radiusScale(d.length);
    })
    .style('fill', function (d) {return colorScaleGenre(d.genre)});
    //.style('fill', function (d) {return colorScaleCountry(d.country)});

  items.append('text')
      .text(function(d) {return d.title});

}

//TODO: make x scale a fix raster
//TODO: fix yscale
