/* 
   Spotify
clientId:  34d5655fd0554c40a1e260cb9acbb4b3
clientSecret:  78942d946d334f63b619fe10e2797b01

   OMDB API
APIkey: 40e9cece
*/

//************************************************//
//*****       set required npm modules       *****//
//************************************************//
//
//-- file system  --//
	var fs = require("fs");

//-- requests  --//
	var request = require("request");

//-- inquirer  --//
	var inquirer = require("inquirer");

//-- timestamp
	var timestamp = require("time-stamp");

//-- twitter --//
	var keys = require("./keys.js");
	var twitter = require("twitter");
	var client = new twitter(keys.twitterKeys);

//-- spotify --//
	var Spotify = require("node-spotify-api");
	var spotifyLookup = new Spotify({
		id: "34d5655fd0554c40a1e260cb9acbb4b3",
		secret: "78942d946d334f63b619fe10e2797b01"
		});



//************************************************//
//*****    declare global variables          *****//
//************************************************//
//
	//var inputs = {};
	var selectMusic = "";
	var selectMovie = "";
	var randomMusic = "";
	var randomMovie = "";
	var randomChoiceArray = ["my-tweets", "spotify-this-song","movie-this"]
	var randomDoStuff = Math.floor(Math.random()*3) ;
	var randomChoice = randomChoiceArray[randomDoStuff];
	var randomIndex = Math.floor(Math.random()*20) ;

	fs.readFile("randomMusic.txt", "utf8", function(error, data) {
			if (error) {
		    	return console.log(error);
		  	};
		var randomArray = data.split(",");
		randomMusic = randomArray[randomIndex];
		});


	fs.readFile("randomMovies.txt", "utf8", function(error, data) {
			if (error) {
		    	return console.log(error);
		  	};
		var randomArray = data.split(",");
		randomMovie = randomArray[randomIndex];
		});

	


//************************************************//
//*****             liri inputs              *****//
//************************************************//
//
	inquirer.prompt([
	  {
	    type: "list",
	    message: "What do you want to do?",
	    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-say"],
	    name: "action"
	  },
	   {
	    type: "input",
	    message: "What song do you want?",
	    name: "music"
	  },
	  {
	    type: "input",
	    message: "What movie do you want?",
	    name: "movie"
	  }
	  ])
//************************************************//
//*****          liri inputs - actions       *****//
//************************************************//
//
	.then(function(user) {
		   
//  ---- log inputs and set variables
		   //inputs = user; 
		   var inputResults =  	"**********************  Liri Request  ************************" + "\r\n" +
		   	"**  Request Date: " + timestamp('YYYY/MM/DD HH:mm:ss') + "\r\n" +
		   	"**  Request Inputs: " + "\r\n" +
		   	"**       Action: " + user.action + "\r\n" +
		   	"**       Music:  " + user.music + "\r\n" +
		   	"**       Movie:  " + user.movie + "\r\n" +
		   	"**  Random Choice: " + randomChoice + "\r\n" +
		   	"**  Random Music: " + randomMusic + "\r\n" +
		   	"**  Random Movie: " + randomMovie + "\r\n" +
		   	"**************************************************************"+ "\r\n";
	       console.log(inputResults);
	       writeToLog(inputResults);

//  ---- test for and run desired action 
	switch (user.action) {
		case "my-tweets" : 
			myTweets(); 
			break;
		case "spotify-this-song" : 
			if (user.music) {selectMusic = user.music }
	        	else {selectMusic = "The Sign"};
			spotifyThisSong(); 
			break;
		case "movie-this" : 
			if (user.movie) {selectMovie = user.movie}
	   	   		else {selectMovie = "Mr. Nobody"};
			movieThis(); 
			break;
		case "do-what-it-say" : 
			doWhatItSay(); 
			break;
	};

 });   //------ End liri input .then section

//************************************************//
//*****             liri functions           *****//
//************************************************//
//
//--  myTweets --//
//
	function myTweets(){
		client.get("statuses/user_timeline", function(error, tweets, response) {
			  if (!error) {
			    //console.log(tweets);
				for(var i = 0; i < tweets.length; i++) {
					var twitterResults = "@" + tweets[i].user.screen_name + ": " +  tweets[i].text + "\r\n" + 
						tweets[i].created_at + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
					console.log(twitterResults);
					writeToLog(twitterResults); 
				}

			  }
			  else {
                    // tell the user the error
                    console.log("There was an Error: "+error);
                    writeToLog("There was an Error: "+error+'\n');
                }
		});

	};


//--  Spotify This Song --//
//
	function spotifyThisSong(){
		spotifyLookup.search({ type:"track", query: selectMusic, limit:5}, function(err,data){
			 if (err) {
			    return console.log("There was an Error: "+error);
                       //writeToLog("There was an Error: "+error+'\n');
			  }
			  //console.log(JSON.stringify(data, null, 2)); 
			  var items = data.tracks.items;
			  
			 for(var i =0; i < items.length; i++){
			 	var songArtists = "";
			 	for(var j =0; j < items[i].artists.length; j++){
                    songArtists= items[i].artists[j].name + "   "; 
                };

	 			var songResults = "Song Title: " + items[i].name + "\r\n" + 
	 				"Album: " + items[i].album.name + "\r\n" +
	 				"Listen: " + items[i].external_urls.spotify + "\r\n" +
					"Artist: " + songArtists + "\r\n" +
	 				"------------------------------ " + i + " ------------------------------" + "\r\n"; 
				console.log(songResults);
				writeToLog(songResults); 
			}
		});
	};


//--  Movie This --//
//
	function movieThis(){
		var queryUrl = "http://www.omdbapi.com/?t=" + selectMovie + "&y=&plot=short&r=json&apikey=40e9cece";
		request(queryUrl, function(error,response,body){
		  if(!error && response.statusCode == 200) {
		 	//console.log(JSON.parse(body));
		 	var ratingDisplay = "";
		 	var rList = JSON.parse(body).Ratings
		 	if (rList.length > 1 ) {
		 		ratingDisplay = rList[1].Value
		 		}
		 	else {ratingDisplay = "Not Available"};
		
		 	var movieResults = "Title: " +  JSON.parse(body).Title + "\r\n" + 
		 		"Year: " + JSON.parse(body).Year + "\r\n" +
		 		"imdb Rating: " + JSON.parse(body).imdbRating + "\r\n" +
		 		"County: " + JSON.parse(body).Country + "\r\n" +
		 		"Language: " + JSON.parse(body).Language + "\r\n" +
		 		"Plot: " + JSON.parse(body).Plot + "\r\n" +
		 		"Actors: " + JSON.parse(body).Actors + "\r\n" +
		 		"Rotten Tomatoes: " + ratingDisplay + "\r\n" +
				"------------------------------------------------------------" + "\r\n";
			
			console.log(movieResults);
			writeToLog(movieResults); 
			
			}
		})
	};



//--  do what it saya --//
//
	function doWhatItSay(){
		switch (randomChoice) {
			case "my-tweets" : 
				myTweets(); 
				break;
			case "spotify-this-song" :
				selectMusic = randomMusic;
				spotifyThisSong(); 
				break;
			case "movie-this" : 
				selectMovie = randomMovie;
				movieThis(); 
				break;
		};
	};


//--  write to log  --//
//
	function writeToLog(logStuff) {
	    fs.appendFile('log.txt', logStuff, (err) => {
	        if (err) throw err;
	    });
	};






