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
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;