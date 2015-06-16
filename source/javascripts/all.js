//= require_self

d3.csv("data/films.csv",function(error,data) {
    dataViz(data);


});


function dataViz(incomingData) {
    d3.select("body").selectAll("div.films")
        .data(incomingData)
        .enter()
        .append("div")
        .attr("class", "films")
        .html(function (d, i) {
            return d.Film;
        });

    var movieArray = [];
    incomingData.map(function(d){
        movieArray.push([d.Film])
    });


    function getInfo() {
        for (var i = 0; i < movieArray.length; i++) {
            axios.get('http://www.omdbapi.com/', {
                params: {
                    t: movieArray[i]
                }
            }).then(function (response) {
                console.log(response.data)
            });
        }
    };
    getInfo();
}



