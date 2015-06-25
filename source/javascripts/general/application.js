bf.lastView = undefined;
bf.currentView = 'time';

bf.viewFinder = function(view){
  switch(view) {
    case 'time':
      return bf.timeView;
      break;
    case 'whatever':
      return bf.seriesView;
      break;
  }

  return undefined;
};

$(function() {
  $('.button').click(function(){
    if(bf.currentView == 'time') {
      bf.changeToView('whatever');
    } else {
      bf.changeToView('time');
    }
  });

  bf.loadData(function(){
    bf.prepare();
    bf.timeView.prepare();
    bf.seriesView.prepare();
    bf.updateView();
  });
});

bf.changeToView = function(view) {
  bf.lastView = bf.currentView;
  bf.currentView = view;
  bf.updateView();
};

bf.updateView = function(){
  if(bf.lastView) {
    bf.viewFinder(bf.lastView).clear();
  }

  bf.viewFinder(bf.currentView).draw();
};
