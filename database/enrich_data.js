var fs = require('fs');
var axios = require('axios');

var movies = JSON.parse(fs.readFileSync('./data/movies.json'));

var c = 0;

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
