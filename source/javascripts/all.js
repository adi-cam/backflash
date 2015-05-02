//= require './data'
//= require_self

function updateList(){
  var items = d3.select('.list').selectAll('.movie').data(DATA);

  items.enter().append('div')
    .attr('class', 'movie')
    .text(function(d) { return d.title; });

  items.exit().remove();
}

$(function(){
  updateList();
});
