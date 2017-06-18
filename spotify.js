var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "34d5655fd0554c40a1e260cb9acbb4b3",
  secret: "78942d946d334f63b619fe10e2797b01"
});
 
spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(JSON.stringify(data, null, 2)); 
});