bf.seriesView = {};

bf.seriesView.seriesScaleX = undefined;
bf.seriesView.seriesScaleY = undefined;
bf.seriesView.forceLayout = undefined;


bf.seriesView.prepare = function() {
};


bf.seriesView.draw = function() {
  var anchorNodes = bf.series.map(function(s, i){
    console.log(i);
    return {
      fixed: true,
      x: i * bf.width / (bf.series.length - 1),
      y: bf.height / 2
    };
  });

  var nodes = bf.movies.concat(bf.topics).concat(bf.series).concat(anchorNodes);

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

  // anchor series
  bf.series.forEach(function(s, i){
    s.topics.forEach(function(t){
      edges.push({type: 'as', source: t, target: anchorNodes[i] });
    });
  });

  //var lines = bf.svg.selectAll('.edge').data(edges)
  //  .enter().append('line').style('stroke', 'white');

  bf.seriesView.forceLayout = d3.layout.force()
    .size([bf.width, bf.height - 300])
    .charge(function(d) {
      return -Math.pow(bf.radiusScale(d.length || 0), 2.0) *6;
    })
    .nodes(nodes)
    .links(edges)
    .friction(0.4)
    .gravity(0.6)

    .on("tick", forceTick)
    .linkStrength(function(l){
      switch(l.type) {
        case 'mt': return 1; break;
        case 'ts': return 1; break;
        case 'as': return 4; break;
      }
    });


console.log(bf.elements);

  bf.elements.select('circle')
    .attr('class', 'nodeCircle')
    .attr("r", function(d) {
      return bf.radiusScale(d.length); })
    .style("fill", function(d){
      return bf.colorScaleGenre(d.genre);
    });

  var middleNode = bf.svg.selectAll('.topicNode')
   .data(bf.topics)
   .enter()
   .append('g')
   .attr('class', 'node');

  middleNode.append("text")
  .style("text-anchor", "middle")
  .attr("y", 15)
  .style('fill', 'white')
  .text(function(d) {return d.name;});



  function forceTick(e) {
    bf.elements.attr('transform', function(d) {
      return "translate (" + (d.x) + "," + (d.y) + ")";
    });

    middleNode.attr('transform', function(d) {
      return "translate (" + (d.x) + "," + (d.y) + ")";
    });

    //lines.attr("x1", function(d) { return d.source.x; })
    //  .attr("y1", function(d) { return d.source.y; })
    //  .attr("x2", function(d) { return d.target.x; })
    //  .attr("y2", function(d) { return d.target.y; });
  }

  bf.seriesView.forceLayout.start();
};

bf.seriesView.clear = function(){
  bf.seriesView.forceLayout.stop();
};


