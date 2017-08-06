var mongoose = require("mongoose");

var gagSchema = new mongoose.Schema({
    title: String,
    image: String,
    category: {type: String, default: "Chistes"},
    info: {type: String, default: Date.now()},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
    ],
    views: {type: Number, default: 1},
    commentsNumber:{type: Number, default: 0}
});

module.exports = mongoose.model("Gag", gagSchema);