bf.currentView = 'time';

$(function() {
  $('.button').click(function(){
    bf.currentView = 'whatever';
    bf.updateView();
  });

  $(window).on('resize', function() {
    bf.updateView();
  });

  bf.loadData(function(){
    bf.timeView.prepare();
    bf.whateverView.prepare();
    bf.updateView();
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
