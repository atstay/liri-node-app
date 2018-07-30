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
    fs.readFile("random.txt", "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		} else if (!error){

            var output = data.split(",");
            action = output[0];
            value = output[1];
            // console.log(action);
            // myTweets()
          }
            switch (action) {
                case "my-tweets":
                    myTweets();
                    break;
    

                    // Can't get spotify function to read value variable
                case "spotify-this-song":
                console.log (value)
                console.log("-------------------------")
                spotifyThisSong(value);
                    break;
    
                    // Can't get movie function to read value variable
                case "movie-this":
                    movieThis(value);
                    break;
    
                case "do-what-it-says":
                    doWhatItSays();
                    break;
            }})};
