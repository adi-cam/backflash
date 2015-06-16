//= require_self

d3.json('data.json', function(_, data) {
    dataViz(data);
});

function dataViz(data) {
    console.log('go d3!', data);
/*
    d3.select("body").selectAll("div.films")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "films")
        .html(function (d, i) {
            return d.Film;
        });
*/
}
