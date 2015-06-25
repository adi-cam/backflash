bf.currentView = 'whatever';

$(function() {
  $('.button').click(function(){
    bf.currentView = 'whatever';
    bf.updateView();
  });

  bf.loadData(function(){
    // prepare views
    bf.timeView.prepare();
    bf.whateverView.prepare();
    bf.updateView();
    $(window).on('resize', function() {
      bf.updateView();
    });

  });
});

bf.updateView = function(){
  switch(bf.currentView) {
    case 'time':
      bf.timeView.draw();
      break;
    case 'whatever':
      bf.whateverView.draw();
      break;
  }
};
