var express = require("express");
var app = express();
var router = express.Router();
var User = require("../models/user");
var mongoose = require("mongoose");
var multer = require("multer");
var passport = require("passport");
var bodyParser = require("body-parser");
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({extended: true}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

//SHOW & EDIT- Display User Profile
router.get("/:id/edit", function(req, res) {
    //Find the current user
    res.render("profile", {currentUser: req.user} );
    console.log(req.user)
})

//UPDATE - Update User Profile
router.put("/:id", function(req, res) {
    //Capture new data
    var newUsername = req.body.username;
    var newEmail    = req.body.email;
    var newPassword = req.body.password;
    var avatar      = "";
    if(!req.file){
        var avatar = req.body.url
    } else {
        var avatar = "/uploads/" + req.file.filename;
    }
    var updateProfile = { username: newUsername, email: newEmail, password: newPassword, avatar: avatar };

    User.findByIdAndUpdate(req.params.id, updateProfile, function(err, update){
    	if(err){
    		console.log(err)
    	} else {
    		res.redirect("profile")
    		console.log(newUsername)
    		console.log(newEmail)
    		console.log(updateProfile)
    		console.log(req.body)
    		console.log(req.params.id)
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