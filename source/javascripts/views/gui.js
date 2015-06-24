bf.loadView = {};


bf.loadView.gui = function(){

  var dropdown = document.querySelectorAll('.dropdown');

  var dropdownArray = Array.prototype.slice.call(dropdown,0);
  console.log(dropdownArray);

  dropdownArray.forEach(function(el){
    var button = el.querySelector('a[data-toggle="dropdown"]'),
      menu = el.querySelector('.dropdown-menu');

    button.onclick = function(event) {
      if(!menu.hasClass('show')) {
        menu.classList.add('show');
        menu.classList.remove('hide');
        event.preventDefault();
      }
      else {
        menu.classList.remove('show');
        menu.classList.add('hide');
        button.classList.remove('open');
        button.classList.add('close');
        event.preventDefault();
      }
    };
  });

  Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
  };
};
