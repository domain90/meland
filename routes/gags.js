var express      = require("express");
var app          = express();
var router       = express.Router();
var Gag          = require("../models/gags");
var mongoose     = require("mongoose");
var multer       = require("multer");
var passport     = require("passport");
mongoose.Promise = require('bluebird');
var middleware   = require("../middleware/index.js");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

///////////////////////
//Classify the content
///////////////////////
//Chistes, Index
router.get("/chistes", function(req, res){
    Gag.find({ category: "Chistes" }).sort({info: -1}).exec(function(err, allChistes){
        if(err) {
            console.log(err)
        } else {
            res.render("gags/index", { Gags: allChistes, currentUser: req.user} )
        }
    })
})

//Deportes
router.get("/deportes", function(req, res){
    Gag.find({ category: "Deportes" }).sort({info: -1}).exec(function(err, allDeportes){
        if(err) {
            console.log(err)
        } else {
            res.render("gags/index", { Gags: allDeportes, currentUser: req.user} )
        }
    })
})

//Mujeres
router.get("/mujeres", function(req, res){
    Gag.find({ category: "Mujeres" }).sort({info: -1}).exec(function(err, allMujeres){
        if(err) {
            console.log(err)
        } else {
            res.render("gags/index", { Gags: allMujeres, currentUser: req.user} )
        }
    })
})

///////////////////////
//REST
///////////////////////
//INDEX
router.get("/", function(req, res){
    //Get campgrounds
    Gag.find({}, function(err, allgags){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            res.render("gags/index", {Gags: allgags, currentUser: req.user});
        }
    })
})

//NEW - show form to add
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("gags/new");
})

app.use(middleware.isLoggedIn);
//CREATE
router.post("/", upload.single('gag'), function(req, res){
    //get data from form and add to array
    var title = req.body.title;
    var image = "";
    if(!req.file){
        var image = req.body.url
    } else {
        var image = "/uploads/" + req.file.filename;
    }
    var info = req.body.info;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var category = req.body.category;
    var newGag = {title: title, image: image, info: info, author: author, category: category};
    //Save to database
    Gag.create(newGag, function(err, newlyGag){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            //redirect to index
            console.log(newlyGag)
            res.redirect("/");
        }
    })
    
   
})


//SHOW - displays more info about clicked/selected camp
router.get("/gags/:id", function(req, res) {
    //find campground with provided ID
    Gag.findByIdAndUpdate(req.params.id, { $inc: { views: 1 }})
       .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
                path: 'reply',
                model: 'Reply'
            }
        })
       .exec(function(err, foundGag){
        if(err){
            console.log(err);
        } else {
            //show more info in a template
            res.render("gags/show", {gag: foundGag});
        }
    })
})

//EDIT 
router.get("/gags/:id/edit", middleware.checkGagOwnership,function(req, res){
    Gag.findById(req.params.id).exec(function(err, foundGag){
        res.render("gags/edit", {gag: foundGag});
    })
})


//UPDATE
router.put("/:id", middleware.checkGagOwnership,function(req, res){
    // var title    = req.body.title;
    // var category = req.body.category;
    // var newGag = {title: title, category: category};
    //Find and update the right campground
    Gag.findByIdAndUpdate(req.params.id, req.body.gag).exec(function(err, updatedGag){
        if(err){
            res.redirect('/gags')
        } else {
            //show more info in a template
            res.redirect('/gags/' + req.params.id);
        }
     })
})

//DESTROY 
router.delete("/gags/:id", middleware.checkGagOwnership, function(req, res){
     Gag.findByIdAndRemove(req.params.id).exec(function(err){
        if(err){
            res.redirect('/gags')
        } else {
            //show more info in a template
            res.redirect('/');
        }
     })
})

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

// =====================================
// GOOGLE ROUTES =====================
// =====================================
// route for Google authentication and login
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/'
}));

module.exports = router;