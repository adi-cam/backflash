var GENRES = {
  1: 'horror',
  2: 'action',
  3: 'drama',
  4: 'sci-fi'
};

var DATA = [
  {
    title: 'Forbidden Planet',
    year: 1989,
    date: new Date(2015, 5, 2),
    genre: 1
  },
  {
    title: 'The Avengers',
    year: 2015,
    date: new Date(2015, 4, 28),
    genre: 2
  },
  {
    title: "L'atalantet",
    year: 1934,
    date: new Date(2015, 4, 5),
    genre: 3
  },
  {
    title: 'Contact',
    year: 1997,
    date: new Date(2015, 3, 25),
    genre: 4
  },
  {
    title: 'District 9',
    year: 2009,
    date: new Date(2015, 3, 10),
    genre: 4
  }
];

function updateList(){
  var items = d3.select('.list').selectAll('.movie').data(DATA);

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
    .attr('cy', 200);

  items.exit().remove();
}

$(function(){
  updateList();
  updateGraph();
});
