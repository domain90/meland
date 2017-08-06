var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({   
    username: String,
    password: String,
    info: {type: String, default: Date.now()},
    avatar: String,
    email: String,

    facebook         : {
        id           : String,
        token        : String
    },
    google        : {
        id           : String,
        token        : String
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);