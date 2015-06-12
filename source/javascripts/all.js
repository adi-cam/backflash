//= require './data'
//= require_self

d3.csv("/data/Dataset_Veranstaltunge.csv",function(error,data) {
    dataViz(data);
}});

function dataViz(incomingData) {
    var maxPopulation = d3.max(incomingData, function (el) {
            return parseInt(el.population);
        }
    );
}

function updateList(){
  var items = d3.select('.list').selectAll('.movie').data(data);

  items.enter().append('div')
    .attr('class', 'movie')
    .text(function(d) { return d.title; });

  items.exit().remove();
}

function updateGraph(){
  var items = d3.select('.graph').selectAll('.point').data(DATA);

  items.enter().append('circle')
    .attr('class', 'point')
    .attr('r', function(d, i){
      console.log(this, d, i);

      return d.year - 1920;
    })
    .attr('cx', function(_, i){
      return i * 300 + 10;
    })
    .attr('cy', 200)

  items.exit().remove();
}

$(function(){
  updateList();
  updateGraph();
});
