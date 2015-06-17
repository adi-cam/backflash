var fs = require('fs');
var csv = require('csv');

//load the original csv files
//take readFileSync to have things happen more simultaneously
var rawMovies = fs.readFileSync('./input/movies.csv');
var rawEvents = fs.readFileSync('./input/events.csv');

//variable for the parsed, old data
var dataMovies, dataEvents;

//parse the raw data
//nest the functions so that it stays in scope
//when done, call the function transformData
function parseRawData() {
  csv.parse(rawMovies, function(_, d1) {
    dataMovies = d1;
      csv.parse(rawEvents, function(_, d3) {
        dataEvents = d3;

        transformData();
    });
  });
}

//arrays for the new json data
var movies = [];
var events = [];

//put single lines and columns in parsed csv files into objects with different in the new json file
//p.ex. movie.title = dataMovies[i][1] -> Iterates through rows of column one
//we save the iterating rows in variable m, as we'll use it multiple times
function transformData(){
  for(var i=1; i<dataMovies.length; i++){
    var m = dataMovies[i];

    var movie = {};
    movie.id = parseInt(m[1]);
    movie.title = m[2];
    movie.genre = m[3];
    movie.country = m[4];
    movie.year = parseInt((m[5]).split(".")[2]);
    movie.director = m[6];
    movie.length = parseInt(m[7]);
    movie.eventid = m[0];

    //If there is a movie id and a movie director push the data the movie object
    if(movie.id >= 0) {
      movies.push(movie);
    }
  }


  //do the same things with the events
  for(var j=1; j<dataEvents.length; j++) {
    var e = dataEvents[j];

    var event = {};
    event.id = e[0];
    event.type = e[2];
    event.date = (e[5]);
    event.series = e[3];
    event.topic = e[4];
    event.title = e[1];
/*    if (event.title.length <=0 && event.id == dataMovies[j][0]) {
        event.title = dataMovies[j][2];
      }*/

    if(event.id) {
      events.push(event);
    }
  }
//call the function saveData()
  saveData();
}

//write the files with the correspoinding object (movies, events).
//null and 2 specifiy a pretty line json
function saveData() {
  fs.writeFileSync('./data/movies.json', JSON.stringify(movies, null, 2));
  fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
  console.log('done!');
}

parseRawData();
