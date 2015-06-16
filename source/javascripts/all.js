//= require_self

axios.get('http://www.omdbapi.com/', {
    params: {
        s: 'Frozen',
        y:'true'
    }
}).then(function(response){
    console.log(response.data)
})
