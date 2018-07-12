var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link:{
        type: String
    },
    summary: {
        type: String
    },
    picture: {
        type: String
    }
})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;