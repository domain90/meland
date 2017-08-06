var mongoose = require("mongoose");

var replySchema = new mongoose.Schema({
    text: String,
    info: {type: String, default: Date.now()},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        avatar: String
    },
    parentComment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
    ],
    votes: {type: Number, default: 1}
});

module.exports = mongoose.model("Reply", replySchema);