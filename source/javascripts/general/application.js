bf.currentView = 'time';

$(function() {
  $('.button').click(function(){
    bf.currentView = 'whatever';
    bf.updateView();
  });

  bf.loadData(function(){
    // prepare views
    bf.timeView.prepare();

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
