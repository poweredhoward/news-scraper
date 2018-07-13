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

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/nyt");

console.log("adsf");


app.get('/', function(req, res){
    // res.sendFile(__dirname + '/public/index.html');
    db.Article.find({}).then( result =>{
        console.log("finding");
        // console.log(result)
        res.render("index", {results: result});
    })
        
  });

app.post("/note", (req, res)=>{
    console.log(req.body);
    // db.Note.insert(req.body.article_id).then(
    db.Note.create({
        content: req.body.content
    }).then(function(newNote){
        db.Article.findByIdAndUpdate(
            req.body.article_id,
            { $push: {notes: newNote}}
        ).then(function(data){
            console.log(data)
            res.json(data);
        })
    })    
})


app.get("/note/:id", function(req, res){
    // console.log(req.body);
    console.log(req.params.id);

    db.Article.findById(req.params.id).populate("notes")
    .then(function(notes){
        console.log(notes);
        res.json(notes);
    })
})


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