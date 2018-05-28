var express = require("express");
var app = express();
var request = require("request");

var OMDB_API_KEY = "260265f";
var OMDB_BASE_URL = "https://www.omdbapi.com?apiKey=" + OMDB_API_KEY;


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(request, response) {
   response.render("movieLandingPage"); 
});

app.get("/movie", function(req, res) {
   var searchTerm = req.query.searchTerm;
   var url = OMDB_BASE_URL + "&s=" + searchTerm;
   
   var movies = [];
   request(url, function(error, response, body) {
      if (error) {
         response.send("Error occurred");   
      }
      else {
         var parsedBody = JSON.parse(body);
         var searchResults = parsedBody.Search;
         if (searchResults) {
            for (let i = 0; i < searchResults.length; i++) {
               var searchResult = searchResults[i];
               var movie = {title: searchResult.Title,
                            year: searchResult.Year,
                            poster: searchResult.Poster,
                            imdbId: searchResult.imdbId,
                            type: searchResult.Type
                           };
               movies.push(movie);
            }
         }
         else {
            response.send("Error occurred");
         }
      }
      
      res.render("movieLandingPage", {movies});
   });
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Movie server has been started..."); 
});