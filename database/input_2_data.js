var fs = require('fs');
var csv = require('csv');

var rawMovies = fs.readFileSync('./input/movies.csv');
var rawGenres = fs.readFileSync('./input/genres.csv');
var rawEvents = fs.readFileSync('./input/events.csv');

var dataMovies, dataGenres, dataEvents;

function parseRawData() {
  csv.parse(rawMovies, function(_, d1) {
    dataMovies = d1;
    csv.parse(rawGenres, function(_, d2) {
      dataGenres = d2;
      csv.parse(rawEvents, function(_, d3) {
        dataEvents = d3;

        transformData();
      });
    });
  });
}

var movies = [];
var events = [];

function transformData(){
  for(var i=1; i<dataMovies.length; i++){
    var m = dataMovies[i];

    var movie = {};
    movie.id = parseInt(m[0]);
    movie.title = m[1];
    movie.country = m[4];
    movie.year = m[6];
    movie.director = m[7];
    // movie.length = m[?];

    if(movie.id >= 0 && movie.director) { // TODO: lower filters
      movies.push(movie);
    }
  }

  for(var j=1; j<dataEvents.length; j++) {
    var e = dataEvents[j];

    var event = {};
    event.id = e[0];
    event.title = e[1];
    event.type = e[2];
    event.date = e[6];
    event.series = e[3];
    event.topic = e[4];

    if(event.id && event.title) { // TODO: lower filters
      events.push(event);
    }
  }

  saveData();
}

function saveData() {
  fs.writeFileSync('./data/movies.json', JSON.stringify(movies, null, 2));
  fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
  console.log('done!');
}

parseRawData();
