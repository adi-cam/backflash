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
  saveData();
}

function saveData() {
  fs.writeFileSync('./data/movies.json', JSON.stringify(movies));
  fs.writeFileSync('./data/events.json', JSON.stringify(events));
  console.log('done!');
}

parseRawData();
