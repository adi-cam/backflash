bf.seriesView = {};

bf.seriesView.seriesScaleX = undefined;
bf.seriesView.seriesScaleY = undefined;
bf.seriesView.forceLayout = undefined;


bf.seriesView.prepare = function() {
  //Turn series into numbers
  bf.seriesView.seriesScaleX = d3.scale.ordinal().domain(bf.series).rangePoints([1, 5]);
  bf.seriesView.seriesScaleY = d3.scale.ordinal().domain(bf.series).rangePoints([1, 5]);
};


bf.seriesView.draw = function() {
  var width = $(window).width();
  var height = $(window).height();

  var nodes = bf.movies.concat(bf.topics).concat(bf.series); //combines the objects of topics and movies into one array of objects (nacheinander)

  // create edges for mappings
  var edges = [];
  bf.topics.forEach(function(t){
    t.events.forEach(function(e){
      e._movies.forEach(function(m){
        edges.push({ type: 'mt', source: m, target: t })
      });
    });

    edges.push({ type: 'ts', source: t, target: t.series });
  });

  bf.seriesView.forceLayout = d3.layout.force()
    .size([width, height])
    .charge(function(d) {
      return -Math.pow(bf.radiusScale(d.length || 0), 2.0) *7;
    })
    .nodes(nodes)
    .links(edges)
    .friction(0.4)
    .gravity(0.3)
    .on("tick", forceTick)
    .linkStrength(function(l){
      switch(l.type) {
        case 'mt': return 1; break;
        case 'ts': return 3; break;
      }
    });

  bf.elements.select('circle')
    .attr('class', 'nodeCircle')
    .attr("r", function(d) {
      return bf.radiusScale(d.length); })
    .style("fill", function(d){
      return bf.colorScaleGenre(d.genre);
    });

  d3.select('svg').select('.nodeCircle')
  .data(bf.topics)
  .enter()
  .append("text")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(function(d) {return d.title;});

  function forceTick(e) {
    bf.elements.attr('transform', function(d) {
      return "translate (" + (d.x) + "," + (d.y) + ")";
    });
  }

  bf.seriesView.forceLayout.start();
};

bf.seriesView.clear = function(){
  bf.seriesView.forceLayout.stop();
};


