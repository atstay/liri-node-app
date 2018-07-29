//require the use of .env to hide the keys
require("dotenv").config();


//variables
  var keys = require("./keys.js");    
  var fs = require('fs');
  var Spotify = require ('node-spotify-api');
  var spotify = new Spotify(keys.spotify);
  var Twitter = require ("twitter");
  var client = new Twitter(keys.twitter);
  var request = require('request');
  var movieName = process.argv[3];
  var returnLiri= process.argv[2];

//switch for commands
switch (returnLiri) {
    case 'my-tweets':
    myTweets();
    break;

    case 'spotify-this-song':
    spotifyThisSong();
    break;

    case 'movie-this':
    movieThis();
    break;

    case 'do-what-it-says':
    doWhatItSays();
    break;
}


//Twitter Command 
function myTweets() {
    var params = {screen_name: ''};
	
		client.get('statuses/user_timeline', params, function(error, tweets) {
			if (!error) {
				for (i = 0; i < tweets.length; i ++){
					console.log("Tweet: " + "'" + tweets[i].text + "'" + " Created At: " + tweets[i].created_at);
				}
			} else {
				console.log(error);
			}
		});

}

//Spotify Command
function spotifyThisSong(song) {
    var song = process.argv[3];
    if (!song) {
        song = 'Ace of Base "The Sign"';
    };
    songRequest = song;
    spotify.search({
        type: "track",
        query: songRequest
    },
        function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items;
                for (var i = 0; i < 1; i++) {
                    if (trackInfo[i] != undefined) {
                        var spotifyResults =
                            "Artist: " + trackInfo[i].artists[0].name + "\n" +
                            "Song: " + trackInfo[i].name + "\n" +
                            "Preview URL: " + trackInfo[i].preview_url + "\n" +
                            "Album: " + trackInfo[i].album.name + "\n"

                        console.log(spotifyResults);
                        console.log(' ');
                    };
                };
            } else {
                console.log("error: " + err);
                return;
            };
        });
};

// Movie Command
function movieThis() {
    if (!movieName) {
        movieName = 'Mr. Nobody';
    };
    //using movieName from var list at top
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
   
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //pull requested data in readable format
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "IMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[1].Value + "\n" +
                "Origin Country: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"

            console.log(queryUrlResults);
        } else {
            console.log("error: " + err);
            return;
        };
    });
};

//Do-What-It-Says Command

function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
            console.log ('hooray')
			var songcheck = dataArr[1].slice(1, -1);
			spotifyThisSong(songcheck);
		} else if (dataArr[0] === "my-tweets") {
			var tweetname = dataArr[1].slice(1, -1);
			twitter(tweetname);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
		
  	});

};
