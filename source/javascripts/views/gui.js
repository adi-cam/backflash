bf.loadView = {};


bf.loadView.gui = function(){

  var dropdown = document.querySelectorAll('.dropdown');

  var dropdownArray = Array.prototype.slice.call(dropdown,0);
  console.log(dropdownArray);

  dropdownArray.forEach(function(el){
    var button = el.querySelector('a[data-toggle="dropdown"]'), //sortieren nach…
      menu = el.querySelector('.dropdown-menu'), //ul with class "dropdown menu"
      menupoints = el.querySelectorAll('.menupoint'), //all li's of dropdown menu
      entireMenu = el.querySelectorAll('.dropdown');



    button.onmouseover = function(event) {
      if(!menu.hasClass('show')) {
        menu.classList.add('show');
        menu.classList.remove('hide');
        event.preventDefault();
      }

     entireMenu.onmouseout = function(event) {
        menu.classList.remove('show');
        menu.classList.add('hide');
        event.preventDefault();
      }
    };
/*      menu.onclick = function(event) {
      this.menu == this.menu-1
    }*/

  });

  Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
  };
};
