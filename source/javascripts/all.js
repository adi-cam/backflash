//= require_self

$(function() {
  d3.json('data.json', function(_, data) {
    dataViz(data);
  });
});

function dataViz(data) {
  var movies = data.movies;
  var events = data.events;


// Data manipulation and formatting
// –––––––––––––––––––––––––––––––––––––

  // convert string date to date objet and save as _date on event object
  events.forEach(function (e) {
    var timeFormat = d3.time.format('%d.%m.%Y');
    e._date = timeFormat.parse(e.date);
  });

  // map movies to events using the eventid and id properties
  movies.forEach(function (m) {
    m._event = events.filter(function (e) {
      return e.id == m.eventid;
    })[0];
  });

  // organizing the countries after regions
  var countriesMatrix = {
    westEurope: ['Deutschland', 'Frankreich', 'Österreich', 'Belgien', 'Niederlande'],
    eastEurope: ['Tschechoslowakei'],
    southEurope: ['Spanien', 'Italien'],
    northEurope: ['Dänemark', 'Schweden', 'GB'],
    home: ['Schweiz'],
    southAsia: ['Japan', 'Südkorea'],
    westAsia: ['Jordan'],
    northAmerica: ['USA']
  };

  var countriesInverseMatrix = {};
  Object.keys(countriesMatrix).forEach(function(region){
    countriesMatrix[region].forEach(function(country){
      countriesInverseMatrix[country] = region;
    });
  });

  movies.forEach(function (m) {
    m._region = countriesInverseMatrix[m.country];
  });

  // get genres and countries and define how many unique categories there are
  var genres = [];
  var countries = [];
  movies.forEach(function (m) {
    genres.push(m.genre);
    countries.push(m.country);
  });

  var months = [];
  events.forEach(function(e){
    months.push(e._date.getMonth());
  });

  var uniqueGenres = _.uniq(genres);
  var uniqueCountries = _.uniq(countries);
  var uniqueMonths = _.uniq(months);

// Scales
// –––––––––––––––––––––––––––––––––––––

  //create location scales
  var maxRuntime = d3.max(movies, function (m) {
    return m.length
  });
  var amountOfMonths = uniqueMonths.length - 2; //TODO: -1 after data set has been cleaned as june is missing

  var yScale = d3.scale.linear().domain([0, amountOfMonths]).range([0, 900]);
  var yScaleRange = d3.scale.ordinal().domain([8, 9, 10, 11, 1, 2, 3, 4]).rangeRoundPoints([0, amountOfMonths]);
  var radiusScale = d3.scale.sqrt().domain([0, maxRuntime]).range([0, 50]);

  //create array for months (9x0)
  var xCursors = d3.range(9).map(function () {
    return 1;
  });

  // create color scale
  var colorScaleGenre = d3.scale.category20([uniqueGenres]);
  var colorScaleCountry = d3.scale.category20([movies._region]);

  //get min and max from year
  var extentYear = d3.extent(movies, function (m) {
    return m.year;
  });

  //create opacity scale
  var opacityScale = d3.scale.linear().domain(extentYear).range([0, 1]);
  console.log(extentYear);
  //create blur scale
  var yearScale = d3.scale.linear().domain(extentYear).range([15, 0]);

  //prepare the tooltip div
  var div = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 50);


// Databinding & Visualization
// –––––––––––––––––––––––––––––––––––––

  var items = d3.select('svg')
      .selectAll('g')
      .data(movies, function (m) {
        return m.id;
      })
      .enter()
      .append('g')
      .attr('data-id', function (d) {
        return d.id;
      })
      .attr("transform", function (d, i) {
        var m2 = yScaleRange(d._event._date.getMonth());
        var x = xCursors[m2];
        var r = radiusScale(d.length);
        xCursors[m2] += r * 2 + 20;
        return "translate (" + ((x + r) + 50) + "," + ((yScale(m2)) + 50) + ")";
      });


  //Blur Filter
  var filter = items.append("defs")
      .append("filter")
      .attr("id", "feGaussianBlur")
      .attr('x', "-200%")
      .attr('y', "-200%")
      .attr('width', "500%")
      .attr('height', "500%")
      .append("feGaussianBlur")
      .attr("stdDeviation", function (d) {
        return yearScale(d.year);
      })
      .attr("result", "blur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "blur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");


  items.append('circle')
      .attr('class', 'movie')
      .attr('r', function (d) {
        return radiusScale(d.length)
      })
    //.style('fill', function (d) {return colorScaleGenre(d.genre)})
      .style('fill', function (d) {
        return colorScaleCountry(d._region)
      })
    //.style('fill-opacity', function (d) {return opacityScale(d.year)})
      .style("filter", "url(#feGaussianBlur)")
      .on("mouseover", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(d.title + ' ' + d._region + ' ' + d.genre + ' ' + d.year + ' ' + d._event._date)
            .style("left", (d3.event.pageX - 20) + "px")
            .style("top", (d3.event.pageY - 40) + "px");
      });
  var text = d3.select('body')
      .selectAll('p')
      .data(movies)
      .enter()
      .append('p')
      .attr('class', 'months')
      .html(function (d){
        return d._event._date.toString().split(' ')[1];
      })
      .attr('x', 10)
      .attr('y', function (d) {
        return yScale(yScaleRange(d._event._date.getMonth()));
      });
}

//TODO: put movies in right order in month
//TODO: Put in Months
//TODO: take widow size instead of fixed dimensions
//TODO: Define own colors!
//TODO: Apply Blur
//TODO: Clean out dataset of xs

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


//items.append('text')
//    .text(function(d) {return d.title})
//    .attr("dy", ".3em")
//    .style("text-anchor", "middle")
//    .style('fill', 'white');
