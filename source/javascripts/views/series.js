bf.seriesView = {};

bf.seriesView.seriesScaleX = undefined;
bf.seriesView.seriesScaleY = undefined;
bf.seriesView.forceLayout = undefined;


bf.seriesView.prepare = function() {
};


bf.seriesView.draw = function() {
  var anchorNodes = bf.series.map(function(s, i){
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
    .size([bf.width, bf.height - 350])
    .charge(function(d) {
      return -Math.pow(bf.radiusScale(d.length || 0), 2.0) *9.5;
    })
    .nodes(nodes)
    .links(edges)
    .friction(0.4)
    .gravity(0.6)

    .on("tick", forceTick)
    .linkStrength(function(l){
      switch(l.type) {
        case 'mt': return 2; break;
        case 'ts': return 1; break;
        case 'as': return 3; break;
      }
    });

  bf.elements.select('circle')
    .attr('class', 'nodeCircle')
    .attr("r", function(d) {
      return bf.radiusScale(d.length); })
    .style("fill", function(d){
      return 'hsl('+(bf.colorScaleH(d.genre))+', 100%, '+ (60 - (bf.Sminus(d.year))) +'%)';
    });

  bf.seriesNode = bf.svg.selectAll('.seriesNode')
   .data(bf.series)
   .enter()
   .append('g')
   .attr('class', 'node');

  bf.seriesNode.append("text")
  .style('fill', 'white')
  .text(function(d) {return d.name;});


  //var topicNodes = bf.svg.selectAll('.topicNodes')
  //  .data(bf.topics)
  //  .enter()
  //  .append('g')
  //  .attr('class', 'node');
  //
  //var topicNodesText = topicNodes.append("text")
  //  .text(function(d) {return d.name;})
  //  .attr('class', 'topicsNodesText')
  //  .style('visibility', 'hidden')
  //  .style("text-anchor", "left")
  //  .style('fill', 'white')
  //  .style('font-size', 11)
  //  .each(function (d) {
  //    var arr = d.name.split('–');
  //    if (arr != undefined) {
  //      for (i = 0; i < arr.length; i++) {
  //        d3.select(this).append("tspan")
  //          .text(arr[i])
  //          .attr("dy", i ? "1.2em" : 0)
  //          .attr("x", 0)
  //          .attr("text-anchor", "middle")
  //          .attr("class", "tspan" + i);
  //      }
  //    }
  //  });





  function forceTick(e) {
    bf.elements.attr('transform', function(d) {
      return "translate (" + (d.x) + "," + (d.y) + ")";
    });

    bf.seriesNode.attr('transform', function(d, i) {
      var x = i * bf.width / (bf.series.length) +140;
      return "translate (" + x + "," + (200) + ")";
    });


    //topicNodes.attr('transform', function(d) {
    //  return "translate (" + (d.x) + "," + (d.y) + ")";
    //});

    //lines.attr("x1", function(d) { return d.source.x; })
    //  .attr("y1", function(d) { return d.source.y; })
    //  .attr("x2", function(d) { return d.target.x; })
    //  .attr("y2", function(d) { return d.target.y; });
  }

  bf.seriesView.forceLayout.start();
};

bf.seriesView.clear = function(){
  bf.seriesView.forceLayout.stop();
  bf.seriesNode.remove();

};


