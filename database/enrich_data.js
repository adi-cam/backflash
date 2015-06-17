var fs = require('fs');
var axios = require('axios');

//load the movies.json file
var movies = JSON.parse(fs.readFileSync('./data/movies.json'));

//set the counter variable to 0
var c = 0;

//iterate through the movies object
//set the i of movies is one movie
//call the api and pass it the movie's title
//promise request: count up.
//if there is no length in the object movie and there is a runtime specified in the api, then the new lenght of the movie is the runtime from the api.
//split it at the space as it is p.ex. 70 min. runtime.split -> return ['70', 'min'] -> [0] -> take the first value in the array.
//parse it to an integer
//when the counter reacher the end of the movies file, write the new file
//pass "movie" into m (?)
for (var i = 0; i < movies.length; i++) {
  var movie = movies[i];
  (function(m){
    axios.get('http://www.omdbapi.com/', {
      params: {
        t: movie.title
      }
    }).then(function(response) {
      c++;

      if(!m.length && response.data.Runtime) {
        m.length = parseInt(response.data.Runtime.split(' ')[0]);
      }

      if(c == movies.length) {
        fs.writeFileSync('./data/movies.json', JSON.stringify(movies, null, 2));
        console.log('done!');
      }
    });
  })(movie);
}
