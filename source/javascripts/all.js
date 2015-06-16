//= require_self


var Request = new XMLHttpRequest();

Request.open('GET', 'http://www.omdbapi.com/?t=Asphalt&y=1929&plot=short&r=json');

Request.setRequestHeader('Accept', 'application/json');

Request.onreadystatechange = function () {
    if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', this.responseText);
    }
};

Request.send(); 