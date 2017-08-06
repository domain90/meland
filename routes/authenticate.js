var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var multer = require("multer");
var Promise = require("bluebird");
var mkdirp = require("mkdirp");

//upload config
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });


//=========================
// AUTHENTICATE
//=========================
//Show form
router.get("/register",function(req, res) {
    res.render("register");
})

//Logic
router.post("/register", upload.single('avatar'), function(req, res, next) {
    var avatar = "/uploads/" + req.file.filename;
    var newUser = new User({ username: req.body.username, avatar: avatar });
    User.register( newUser, req.body.password, function(err, user){ 
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

//Login Form
router.get("/login", function(req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/",
    failureRedirect: "/login"
}) , function(req, res) {
    
})

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

//Middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;