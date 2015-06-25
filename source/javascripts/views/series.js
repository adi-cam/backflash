bf.seriesView = {};

bf.seriesView.seriesScaleX = undefined;
bf.seriesView.seriesScaleY = undefined;
bf.seriesView.forceLayout = undefined;


bf.seriesView.prepare = function() {
  //Turn series into numbers
  bf.seriesView.seriesScaleX = d3.scale.ordinal().domain(bf.series).rangePoints([1, 1000]);
  bf.seriesView.seriesScaleY = d3.scale.ordinal().domain(bf.series).rangePoints([1, 1000]);
};


bf.seriesView.draw = function() {
  var width = $(window).width();
  var height = $(window).height();

  var topics = _.unique(bf.events.map(function(event){return event.topic})) //returns an array of unique topics
    .map(function(topic) {return {id: topic, title: topic}}); //for each topic in the topic array return an object with an id and a title. Both of which give back the topic title as a string

  nodes = bf.movies.concat(topics); //combines the objects of topics and movies into one array of objects (nacheinander)
  edges = _.flatten(topics.map(function(topic) { //for each topic in the topics array
    return bf.movies
      .filter(function(movie) {
        return movie._event.topic === topic.title;  // go through bf.movies and filter after those movies where movie._event.topic matches the topic.title in the topic object
      })
      .map(function(movie) { //for each of those movies set their source to the topic and the target to movie.
        return {
          source: topic,
          target: movie
        };
      });
    })); //edges is an array of objects with a source property and a target property. The target contains the movie object. The source contains the corresponding event.

  bf.seriesView.forceLayout = d3.layout.force()
    .size([width, height])
    .charge(function(d) {
      return -Math.pow(bf.radiusScale(d.length || 0), 2.0) * 6;
    })
    .nodes(nodes)
    .links(edges)
    .friction(0.2)
    .gravity(0)
    .on("tick", forceTick);

  bf.nodes.select('circle')
    .attr('class', 'nodeCircle')
    .attr("r", function(d) {
      return bf.radiusScale(d.length); })
    .style("fill", function(d){
      return bf.colorScaleGenre(d.genre);
    });

  d3.select('svg').select('.nodeCircle')
  .data(topics)
  .enter()
  .append("text")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(function(d) {return d.title;});

  function forceTick(e) {
    var k = .3 * e.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      if (o.hasOwnProperty('_event')) {
        o.y += (bf.seriesView.seriesScaleY(o._event.series) - o.y) * k;
        o.x += (bf.seriesView.seriesScaleX(o._event.series) - o.x) * k;
      }
    });

    bf.nodes.attr('transform', function(d) {
      return "translate (" + (d.x) + "," + (d.y) + ")";
    });
  }

  bf.seriesView.forceLayout.start();
};

bf.seriesView.clear = function(){
  bf.seriesView.forceLayout.stop();
};


