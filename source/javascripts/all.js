//= require_self

d3.csv("data/films.csv",function(error, data) {
    getInfo(data);
});

function getInfo(incomingData) {
    var c = 0;
    for (var i = 0; i < incomingData.length; i++) {
        var movie = incomingData[i];
        axios.get('http://www.omdbapi.com/', {
            params: {
                t: movie.Film
            }
        }).then(function(response) {
            movie.runtime = response.data.Runtime;
            c++;
            if(c == incomingData.length) {
                dataViz(incomingData);
            }
        });
    };

};

function dataViz(incomingData) {
    console.log('go d3!');
/*
    d3.select("body").selectAll("div.films")
        .data(incomingData)
        .enter()
        .append("div")
        .attr("class", "films")
        .html(function (d, i) {
            return d.Film;
        });
*/
}
