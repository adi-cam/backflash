//= require_self

var movieArray = ['Gilda', 'Ossessione', 'Frozen', 'Bambi'];

    function getInfo() {
        for(var i = 0; i < movieArray.length; i++) {
        axios.get('http://www.omdbapi.com/', {
            params: {
                t: movieArray[i]
            }
        }).then(function (response) {
            console.log(response.data)
        });
    }
};
    getInfo();


