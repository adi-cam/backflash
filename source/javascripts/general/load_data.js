/**
 * All the movies.
 */
bf.movies = undefined;

/**
 * All the events.
 */
bf.events = undefined;

/**
 * All the series
 */
bf.series = undefined;

/**
 * All the topics
 */
bf.topics = undefined;

/**
 * Mapping from countries to regions.
 */
bf.countriesMatrix = {
  westEurope: ['Deutschland', 'Frankreich', 'Österreich', 'Belgien', 'Niederlande'],
  eastEurope: ['Tschechoslowakei'],
  southEurope: ['Spanien', 'Italien'],
  northEurope: ['Dänemark', 'Schweden', 'GB'],
  home: ['Schweiz'],
  southAsia: ['Japan', 'Südkorea'],
  westAsia: ['Jordan'],
  northAmerica: ['USA']
};

/**
 * Inverse matrix of above countries matrix.
 */
bf.countriesInverseMatrix = undefined;

/**
 * List of genres.
 */
bf.genres = undefined;

/**
 * List of regions.
 */
bf.regions = undefined;

/**
 * List of countries;
 */
bf.countries = undefined;

/**
 * List of years;
 */
bf.years = undefined;

/**
 * Loads data from JSON file.
 * @param cb Callback
 */
bf.loadData = function(cb) { // dem bf objekt eine Funktion namens loadData hinzufügen
  d3.json('data.json', function(_, data) {
    bf.processData(data);
    cb(data);
  });
};

/**
 * Process raw data.
 * @param data
 */
bf.processData = function(data) {
  // assing to globals
  bf.movies = data.movies;
  bf.events = data.events;

  // convert string date to date objet and save as _date on event object
  bf.events.forEach(function(e) {
    var timeFormat = d3.time.format('%d.%m.%Y');
    e._date = timeFormat.parse(e.date);
  });

  // add empty movies array to events
  bf.events.forEach(function(e){
    e._movies = [];
  });

  // map movies to events using the eventid and id properties
  bf.movies.forEach(function(m) {
    m._event = bf.events.filter(function (e) {
      return e.id == m.eventid;
    })[0];
    m._event._movies.push(m);
  });

  // sort movies by realated event date
  bf.movies = _.sortBy(bf.movies, function(m){
    return m._event._date;
  });

  // organizing the countries after regions
  bf.countriesInverseMatrix = {};

  Object.keys(bf.countriesMatrix).forEach(function(region){
    bf.countriesMatrix[region].forEach(function(country){
      bf.countriesInverseMatrix[country] = region;
    });
  });

  // populate region on movies
  bf.movies.forEach(function (m) {
    m._region = bf.countriesInverseMatrix[m.country];
  });

  // create series objects
  bf.series = _.uniq(bf.events.map(function(e){
    return e.series;
  })).map(function(s){
    return {
      name: s,
      events: [],
      topics: []
    };
  });

  // create topic objects
  bf.topics = _.uniq(bf.events.map(function(e){
    return e.topic;
  })).map(function(t){
    return {
      name: t,
      events: []
    };
  });

  // map events to series and topics and vice versa
  bf.events.forEach(function(e){
    var series = bf.series.filter(function(s){
      return s.name == e.series;
    })[0];

    var topic = bf.topics.filter(function(t){
      return t.name == e.topic;
    })[0];

    e._topic = topic;
    e._series = series;

    series.events.push(e);
    topic.events.push(e);
  });

  bf.topics.forEach(function(t){
    var series = bf.series.filter(function(s){
      return s.name == t.events[0].series;
    })[0];

    t.series = series;
    series.topics.push(t);
  });

  // cleanup series and topics
  //bf.series.forEach(function(s){
  //  s.events = _.uniq(s.events);
  //});
  //bf.topics.forEach(function(t){
  //  t.events = _.uniq(t.events);
  //});

  // get all available genres, countries and regions
  var genres = [];
  var regions = [];
  var countries = [];
  var years = [];

  bf.movies.forEach(function (m) {
    genres.push(m.genre);
    regions.push(m._region);
    countries.push(m.country);
    years.push(m.year);
  });

  bf.yearsAll = _.uniq(years);
  bf.years = _.sortBy(bf.yearsAll, function(d){
    return d
  });

  bf.genres = _.uniq(genres);
  bf.regions = _.uniq(regions);
  bf.count = _.uniq(countries);
};
