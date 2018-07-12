var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
var app = express();

app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
// app.use(express.static("public"));

mongoose.connect("mongodb://localhost/nyt");

console.log("adsf")

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
                pic: $(this).find("img").attr("src")
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