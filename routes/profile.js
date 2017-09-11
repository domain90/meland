var express = require("express");
var app = express();
var router = express.Router();
var User = require("../models/user");
var Gag  = require("../models/gags");
var mongoose = require("mongoose");
var multer = require("multer");
var passport = require("passport");
var bodyParser = require("body-parser");
var tinify = require("tinify");

tinify.key = "2qYGZh9szLO3V7SGxV6XvIH6m9gUn2N8";
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({extended: true}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/' + req.user.id)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

//SHOW & EDIT- Display User Profile
router.get("/profile/:id", function(req, res) {
    //Find current user's posts
     Gag.find({ "author.id": req.user.id}).sort({info: -1}).exec(function(err, foundGag){
        if(err) {
            console.log(err)
        } else {
             //Find the current user
             res.render("profile", {currentUser: req.user, Gags: foundGag} );
             console.log(foundGag);
        }
    })
    console.log(req.user.username)
})

//UPDATE - Update User Profile
router.put("/profile/:id", upload.single('profile'),function(req, res) {
    //Capture new data
    var newUsername = req.body.username;
    var newEmail    = req.body.email;
    var newPassword = req.body.password;
    var avatar      = "";
    if(!req.file){
        avatar = req.user.avatar;
    } else {
        avatar = '/uploads/' + req.user.id + "/" + req.file.filename;
    }
    var updateProfile = { username: newUsername, email: newEmail, password: newPassword, avatar: avatar };

    User.findByIdAndUpdate(req.params.id, updateProfile, function(err, update){
    	if(err){
    		console.log(err)
    	} else {
    		res.redirect("back")
            var source = tinify.fromFile('public/uploads/' + req.user.id + "/" + req.file.filename);
            source.toFile('public/uploads/' + req.user.id + "/" + req.file.filename);
      //       console.log(source)
      //       console.log(avatar)
    		// console.log(updateProfile.avatar)
    		// console.log(req.file);
    	}
    })
    
})



module.exports = router;














































//Middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
}