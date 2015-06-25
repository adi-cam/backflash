bf.lastView = undefined;
bf.currentView = 'time';

bf.viewFinder = function(view){
  switch(view) {
    case 'time':
      return bf.timeView;
      break;
    case 'series':
      return bf.seriesView;
      break;
  }

  return undefined;
};

$(function() {
  bf.loadData(function () {
    bf.prepare();
    bf.timeView.prepare();
    bf.seriesView.prepare();
    bf.updateView();
  });

  $('#select').on('change', function () {
    var e = document.getElementById("select");
    var strUser1 = e.options[e.selectedIndex].text;
    console.log(strUser1);
    if (strUser1 == 'Programm') {
      bf.changeToView('time');
    }
    else if (strUser1 == 'Serie') {
      bf.changeToView('series');
    }
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
