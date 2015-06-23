/**
 * Local namespace for time view.
 */
bf.whateverView = {};

/**
 * YKeys for the vertical distribution of months.
 */
bf.timeView.yKeys = [];
bf.timeView.labels = undefined;

/**
 * All the scales.
 */
bf.timeView.radiusScale = undefined;
bf.timeView.yRangeScale = undefined;
bf.timeView.yScale = undefined;
bf.timeView.colorScaleGenre = undefined;
bf.timeView.colorScaleCountry = undefined;
bf.timeView.opacityScale = undefined;
bf.timeView.blurScale = undefined;
bf.timeView.color = undefined;
bf.timeView.colorScale = undefined;

/**
 * colors
 */
bf.timeView.colorsRGB = undefined;
hsl = undefined;
bf.timeView.colorScaleH = undefined;
bf.timeView.colorScaleS = undefined;
bf.timeView.colorScaleL = undefined;
bf.timeView.Sminus = undefined;



bf.whateverView.prepare = function(){
  // generate yKeys
  bf.events.forEach(function(e){
    var paddedMonth = ('0' + e._date.getMonth()).slice(-2);
    e._tv_yKey = parseInt(e._date.getFullYear() + '' + paddedMonth);
  });

  // collect all yKeys
  var yks = [];
  bf.movies.forEach(function(m){
    yks.push(m._event._tv_yKey);
  });

  //get all unique yKeys from the array, sort the yKeys and reverse their order
  bf.timeView.yKeys = _.uniq(yks).sort().reverse();

  //map yKeys to words for labels
  bf.timeView.labels = d3.scale.ordinal().domain(bf.timeView.yKeys).range(['Mai, 2015', 'April, 2015', 'März, 2015', 'February, 2015',
    'Dezember, 2014', 'November, 2014', 'Oktober, 2014', 'September, 2014']);

  //create location scales
  var maxRuntime = d3.max(bf.movies, function(m){ return m.length });
  bf.timeView.radiusScale = d3.scale.sqrt().domain([0, maxRuntime]).range([0, 50]);
  bf.timeView.radiusScaleForce = d3.scale.linear().domain([0, maxRuntime]).range([-1500, -50]);

  bf.timeView.yRangeScale = d3.scale.ordinal().domain(bf.timeView.yKeys).rangeRoundPoints([0, bf.timeView.yKeys.length-1]);
  bf.timeView.yScale = d3.scale.linear().domain([0, bf.timeView.yKeys.length-1]).range([0, 900]);

  //Prepare RGB and HSL color matrix
  bf.timeView.colorsRGB = ['#DC1F26', '#00A89B', '#EE5325', '#EC1263', '#00B04E', '#FFED2B', '#009AD7', '#17479E'];

  var hsl =[];
  for (i= 0; i<=bf.timeView.colorsRGB.length; i++){hsl.push(d3.rgb(bf.timeView.colorsRGB[i]).hsl());};

  // create color scale for genre or country
  bf.timeView.colorScaleGenre = d3.scale.ordinal().domain(bf.genres).range(bf.timeView.colorsRGB);
  bf.timeView.colorScaleCountry = d3.scale.ordinal().domain(bf.regions).range(bf.timeView.colorsRGB);

  //create color scale for genre and year
  bf.timeView.colorScaleH = d3.scale.ordinal().domain(bf.genres).range([hsl[0].h, hsl[1].h, hsl[2].h, hsl[3].h, hsl[4].h, hsl[5].h, hsl[6].h, hsl[7].h]);
  bf.timeView.colorScaleS = d3.scale.ordinal().domain(bf.genres).range([hsl[0].s, hsl[1].s, hsl[2].s, hsl[3].s, hsl[4].s, hsl[5].s, hsl[6].s, hsl[7].s]);
  bf.timeView.colorScaleL = d3.scale.ordinal().domain(bf.genres).range([hsl[0].l, hsl[1].l, hsl[2].l, hsl[3].l, hsl[4].l, hsl[5].l, hsl[6].l, hsl[7].l]);

  bf.timeView.Sminus = d3.scale.ordinal().domain(bf.years).range([43, 0]);

  // create opacity scale for year
  var extentYear = d3.extent(bf.movies, function(m){ return m.year; });
  bf.timeView.opacityScale = d3.scale.linear().domain(extentYear).range([0.2, 1]);

  // create blur scale for year
  bf.timeView.blurScale = d3.scale.linear().domain(extentYear).range([15, 0]);
};



bf.whateverView.draw = function() {
  var foci = [{x: 150, y: 150}, {x: 350, y: 250}, {x: 700, y: 400}];
  var movies = bf.movies;

  var topics = _.unique(bf.events.map(function(event){return event.topic})) //returns an array of unique topics
    .map(function(topic) {return {id: topic, title: topic}}); //for each topic in the topic array return an object with an id and a title. Both of which give back the topic title as a string

  nodes = bf.movies.concat(topics); //combines the objects of topics and movies into one array of objects (nacheinander). Those are my nodes.
  edges = _.flatten(topics.map(function(topic) { //for each topic in the topics array
    return bf.movies
      .filter(function(movie) {
        return movie._event.topic === topic.title;  // go through bf.movies and filter after those movies where movie._event.topic matches the topic.title in the topic object
      })
      .map(function(movie) { //for each of those movies
        return {
          source: topic,
          target: movie //set their source to the topic and the target to movie.
        };
      });
    })); //edges is an array of objects with a source property and a target property. The target contains the movie object. The source contains the corresponding event.

/*
  var n_movies = nodes.splice(0, 121);
  var n_topics = nodes.splice(121, 17);
  var nodes = n_movies.concat(n_topics);

  console.log(nodes);
  console.log(n_movies);
  console.log(n_topics);*/

  var force = d3.layout.force()
    .size([2000,800])
    .charge(function(d) {
        if (d.length > 1) {
          return -bf.timeView.radiusScale(d.length) * 200;
        } else {
          return -20;
        };
      })
    .chargeDistance(2000)
    .nodes(nodes)
    .links(edges)
    .friction(0.6)
    .linkDistance(-60)
    .gravity(0.8)
    .on("tick", forceTick);

  d3.select("body").append("svg").attr({width:2000, height: 2000});


  var nodeEnter = d3.select("svg").selectAll("g.node")
    .data(bf.movies, function (d) {return d.id})
    .enter()
    .append("g")
    .attr("class", "node");
  nodeEnter.append("circle")
    .attr("r", function(d) {
      return bf.timeView.radiusScale(d.length); })
    .style("fill", function(d){
      return bf.timeView.colorScaleGenre(d.genre);
    });

  seriesEnt = bf.series.map(function(series, i){
    return {
      title: series,
      y: 1000*i,
      x: 1000*i
    }
  });

  setInterval(function() {
    nodes.push({id: ~~(Math.random() * seriesEnt.length)});
  });

  force.start();
  console.log(bf.series);
 console.log(nodes[5]._event.series);


  function forceTick(e) {

/*    var k = .1 * e.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(d, i) {
        d.y += (d._event.series[d.id] * d.y) * k;
        d.x += (d._event.series[d.id] * d.x) * k;
    });*/

    d3.selectAll("g.node")
      .attr("transform", function (d) {
       return "translate("+(d.x-300)+","+(d.y+250)+")";
      })




  }

};

/*
 d3.selectAll("g.node")
 .attr("cx", function(d) {
 return d.x})
 .attr("cy", function(d) {
 return d.y;});
 */


/*  nodeEnter.append("text")
 .style("text-anchor", "middle")
 .attr("y", 15)
 .text(function(d) {return d.title;});*/


/*  var middleNode = d3.select('svg').selectAll('g.middleNode')
 .data(topics, function (d){return d.id})
 .enter()
 .append('g')
 .attr('class', 'node');
 middleNode.append("circle")
 .attr('r', 5)
 .attr('fill', 'black');*/
//middleNode.append("text")
//  .style("text-anchor", "middle")
//  .attr("y", 15)
//  .text(function(d) {return d.title;});

