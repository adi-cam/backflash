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


  //organizing the countries after regions
  var countriesCat= {};
  countriesCat.westEurope = ["Deutschland", 'Frankreich', 'Österreich', 'Belgien', 'Niederlande'];
  countriesCat.eastEurope = ["Tschechoslowakei"];
  countriesCat.southEurope =['Spanien', 'Italien'];
  countriesCat.northEurope =['Dänemark', 'Schweden', 'GB'];
  countriesCat.home = ['Schweiz'];
  countriesCat.southAsia = ["Japan", "Südkorea"];
  countriesCat.westAsia = ['Jordan'];
  countriesCat.northAmerica =['USA'];

  console.log(countriesCat);

  movies.forEach(function (m){
    m._region = movies.filter(function(m){
      for (var i = 0; i<=countriesCat.westEurope.length; i++) {
        if (m.country == countriesCat.westEurope[i]) {
          return m._region = 'WestEurope';
        } else if (m.country == countriesCat.eastEurope[i]){
          return m._region = 'Eastern Europe';
        } else if (m.country == countriesCat.southEurope[i]){
          return m._region = 'Southern Europe';
        } else if (m.country == countriesCat.northEurope[i]){
          return m._region = 'Northern Europe';
        } else if (m.country == countriesCat.eastEurope[i]){
          return m._region = 'Eastern Europe';
        } else if (m.country == countriesCat.northAmerica[i]) {
          return m._region = 'North America';
        } else if (m.country == countriesCat.southAsia[i]) {
          return m._region = 'South Asia';
        } else if (m.country == countriesCat.westAsia[i]) {
          return m._region = 'West Asia';
        } else if (m.country == 'Schweiz') {
          return m._region = 'Switzerland';
        }
        //last movie object gives back array in _region, why???
      }});
  });
  console.log(movies);



  //get genres and countries and define how many unique categories there are
  var genres = [];
  movies.forEach(function(m){
    genres.push(m.genre);
  });

  var countries =[];
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
  };
  var uniqueGenres = unique(genres);
  var uniqueCountries = unique(countries);


  //create location scales
  var yScale = d3.scale.linear().domain([1, 8]).range([0, 900]);
  var yScaleRange = d3.scale.ordinal().domain([1, 2, 3, 4, 8, 9, 10, 11]).rangeRoundPoints([1, 8]);
  var radiusScale = d3.scale.sqrt().domain([0, 480]).range([0, 50]);

  //create array for months (9x0)
  var xCursors = d3.range(9).map(function() { return 1; });

  // create color scale
  var colorScaleGenre = d3.scale.category20([uniqueGenres]); //TODO: Define own colors!
  var colorScaleCountry = d3.scale.category20([uniqueCountries]); //TODO: Define Larger Country Categories
  console.log(uniqueCountries);


  //prepare the tooltip div
  var div = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 50);


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
        var m2 = yScaleRange(d._event._date.getMonth());
        var x = xCursors[m2];
        var r = radiusScale(d.length);
        xCursors[m2] += r * 2 + 20;

        return "translate (" + ((x + r)+50) + "," +((yScale(m2))+50) + ")";

      });

  items.append('circle')
    .attr('class', 'movie')
    .attr('r', function(d){
      return radiusScale(d.length);
    })
    .style('fill', function (d) {return colorScaleGenre(d.genre)})
    //.style('fill', function (d) {return colorScaleCountry(d.country)})
    .on("mouseover", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.title)
        .style("left", (d3.event.pageX)-20+ "px")
        .style("top", (d3.event.pageY-40) + "px");
  });

  //items.append('text')
  //    .text(function(d) {return d.title})
  //    .attr("dy", ".3em")
  //    .style("text-anchor", "middle")
  //    .style('fill', 'white');

};

//TODO: Apply Blur
//find out how many movies there are in each month
/*
var nestedEvents = d3.nest()
    .key(function(e) {
      return e._date.getMonth();
    })
    .entries(events);
console.log(nestedEvents);

nestedEvents.forEach(function(d){
  console.log(d.values.length);
});*/
