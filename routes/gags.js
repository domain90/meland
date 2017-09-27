var express      = require("express");
var app          = express();
var router       = express.Router();
var Gag          = require("../models/gags");
var mongoose     = require("mongoose");
var multer       = require("multer");
var passport     = require("passport");
mongoose.Promise = require('bluebird');
var middleware   = require("../middleware/index.js");
var mkdirp       = require('mkdirp');
var tinify       = require("tinify");
var fs           = require("fs");
var cloudinary   = require('cloudinary');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/tmp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

// var upload = multer({ storage: storage });

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
router.post("/", function(req, res){
    //MAGIC NUMBER
    var upload = multer({
        storage: storage
    }).single('gag')
    upload(req, res, function(err) {

        var MAGIC_NUMBERS = {
            jpg: 'ffd8ffe0',
            jpg1: 'ffd8ffe1',
            png: '89504e47',
            gif: '47494638',
            mp4: '00000020',
            webm: '1a45dfa3'
        }

        //All first characters title should be in uppercase
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
               // You do not need to check if i is larger than splitStr length, as your for does that for you
               // Assign it back to the array
               splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
            }
        // Directly return the joined string
        return splitStr.join(' '); 
        }

        //Check if video is larger than 100mb
        if(req.file.size > 104857600) {
            cloudinary.uploader.upload_large('public/uploads/tmp/' + req.file.filename, function(result) {
                var image = '<video id="meme-content" src=' + '"' + result.url.replace(".gif", ".mp4") + '"' + 'controls loop preload="metadata">' +
                             '<source id="video-source" src=' + '"' + result.url + '"' + ' type="video/mp4">' +
                            '</video>';
            }, 
            { resource_type: "video" });
        }


        cloudinary.v2.uploader.upload('public/uploads/tmp/' + req.file.filename, {resource_type: "auto", use_filename: true, unique_filename: false }, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                //DATA
                var info = req.body.info;
                var author = {
                    id: req.user.id,
                    username: req.user.username
                };
                var category = req.body.category;
                var title = titleCase(req.body.title);
            
                var magic = fs.readFileSync('public/uploads/tmp/' + req.file.filename).toString('hex', 0, 4);

                //Var image
                if(!req.file){
                    var image = req.body.url;
                } else {
                    // var gagTarget = 'public/uploads/tmp/' + req.file.filename;
                    // var image = "/uploads/tmp/" + req.file.filename;
                    // var source = tinify.fromFile(gagTarget);
                    // source.toFile(gagTarget);
                    // console.log(result.url)
                    // var image = result.url; 
                    if(magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png) {
                        var image = '<img id="meme-content" src=' + "'" + result.url + "'" + '>';
                    } else if (magic == MAGIC_NUMBERS.gif || magic == MAGIC_NUMBERS.mp4 || magic == MAGIC_NUMBERS.webm) {
                        // var mp4s = result.url.replace(/\s/g, '');
                        var image = '<video id="meme-content" src=' + '"' + result.url.replace(".gif", ".mp4") + '"' + 'controls loop preload="metadata">' +
                                     '<source id="video-source" src=' + '"' + result.url + '"' + ' type="video/mp4">' +
                                    '</video>';
                    }
                }

                //Gather new data in one var
                var newGag = {title: title, image: image, info: info, author: author, category: category};

                //Save to database
                Gag.create(newGag, function(err, newlyGag){
                    if(err){
                        console.log("An error has occur");
                        console.log(err);
                    } else {
                        //redirect to index
                        console.log(newlyGag);
                        res.redirect("/gags/" + newlyGag.id);
                        console.log(magic);
                        console.log(req.file.size);
                    }
                })
                //END OF GAG CREATE
            }
            //END OF ELSE
        })
        //END OF CLOUDINARY 
        

        //Cloudinary
        
             
    //DATA
    });
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
///////////////////////
//Votes////////////////
///////////////////////
router.post("/gags/:id/upvote", function(req, res) {
    Gag.findById(req.params.id).exec(function (err, foundGag){
        if(err){
            console.log(err)
        } else {
            foundGag.votes = req.body.votes;
            foundGag.save();
            res.json(foundGag.votes);
        }
    })
})

router.post("/gags/:id/downvote", function(req, res) {
    Gag.findById(req.params.id).exec(function (err, foundGag){
        if(err){
            console.log(err)
        } else {
            foundGag.votes = req.body.votes;
            foundGag.save();
            res.json(foundGag.votes);
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