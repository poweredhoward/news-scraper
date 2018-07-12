var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
var app = express();

app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/nyt");

console.log("adsf");


app.get('/', function(req, res){
    // res.sendFile(__dirname + '/public/index.html');
    db.Article.find({}).then( result =>{
        console.log("finding");
        console.log(result)
        res.render("index", {results: result});
    })
        
  });

app.get("/scrape", function(req, res){
    console.log("Inside scraping")

    axios.get("https://www.nytimes.com/section/technology").then( function(response){
        var $ = cheerio.load(response.data);

        var results = [];

        $("article.story").each(function(i, element){
            var result = {
                title: $(this).find(".headline").text().trim(),
                link: $(this).find("a").attr("href"),
                summary: $(this).find(".summary").text(),
                picture: $(this).find("img").attr("src")
            }
            results.push(result);
            db.Article.create(result);
        })
        console.log(results)
        res.json(results);
    })
})

app.listen(PORT, function(){
    
})