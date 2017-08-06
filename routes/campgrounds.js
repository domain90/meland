var express = require("express");
var router = express.Router();
var Gag = require("../models/gags.js");
var Promise = require("bluebird");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

//INDEX
router.get("/", function(req, res){
    //Get campgrounds
    Gag.find({}, function(err, allcampgrounds){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            res.render("/", {campgrounds: allcampgrounds, currentUser: req.user});
        }
    })
    //res.render("campgrounds", {campgrounds: campgrounds});
})

//NEW - show form to add
router.get("/new", isLoggedIn, function(req, res) {
    res.render("gags/new");
})

//CREATE
router.post("/", isLoggedIn, upload.single('gag'), function(req, res){
    //get data from form and add to array
    var name = req.body.name;
    var image = "/uploads/" + req.file.filename;
    var info = req.body.info;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var newCamp = {name: name, images: image, info: info, author: author};
    //Save to database
    Gag.create(newCamp, function(err, newlyCamp){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            //redirect to campgrounds
             res.redirect("/");
        }
    })
    
   
})

//SHOW - displays more info about clicked/selected camp
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Gag.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //show more info in a template
            res.render("gags/show", {campground: foundCampground});
        }
    })
})

//Middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;