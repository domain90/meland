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
var cloudinary   = require("cloudinary");
var aws          = require("aws-sdk");
var multerS3     = require("multer-s3");


///////////////////////
//CONFIGS
///////////////////////
aws.config.update({
    secretAccessKey:"nhNz18sCI8UNUKnxX/MXyLcy6xMop7PyX+pM8Tzl",
    accessKeyId: "AKIAIKS5RNNLVKYM2BCA",
    region: "us-east-1"
})

var s3           = new aws.S3();
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/tmp')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//   }
// });

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
        storage: multerS3({
            s3: s3,
            bucket: 'menacion',
            key: function (req, file, cb) {
                console.log(file);
                cb(null, file.originalname); //use Date.now() for unique file keys
            }
        })
    }).single('gag')
    upload(req, res, function(err, result) {
        if(err) {
            console.log(err);
        }
        var params = {Bucket: 'menacion', Key: req.file.originalname};

        s3.getObject(params, function(err, data){
            if(err) {
                console.log(err);
            } else {
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

                var bucketObj = "http://menacion.s3.amazonaws.com/" + req.file.originalname;
                if(req.file.originalname.indexOf(".jpg" || ".png" || ".jpg1")) {
                    var image = '<img class="b-lazy" id="meme-content" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src=' + "'" + bucketObj + "'" + '>';
                } else if (req.file.originalname.indexOf(".gif" || ".mp4" || ".webm")) {
                    // var mp4s = result.url.replace(/\s/g, '');
                    var image = '<video class="b-lazy" id="meme-content" src=' + '"' + bucketObj.replace(".gif", ".mp4") + '"' + 'controls loop preload="metadata">' +
                                 '<source id="video-source" src=' + '"' + bucketObj + '"' + ' type="video/mp4">' +
                                '</video>';
                }

                var info = req.body.info;
                var author = {
                    id: req.user.id,
                    username: req.user.username
                };
                var category = req.body.category;
                var title = titleCase(req.body.title);

                var newGag = {title: title, image: image, info: info, author: author, category: category};

                Gag.create(newGag, function(err, newlyGag){
                    if(err){
                        console.log("An error has occur");
                        console.log(err);
                    } else {
                        //redirect to index
                        // console.log(req.file.size);
                        // console.log(newlyGag);
                        // fs.unlink('public/uploads/tmp/' + req.file.filename)
                        res.redirect("/gags/" + newlyGag.id);
                    }
                })
            }
           
        })

///////////////////////////////////////////////////////////////////////////////////////////////

        // var MAGIC_NUMBERS = {
        //     jpg: 'ffd8ffe0',
        //     jpg1: 'ffd8ffe1',
        //     png: '89504e47',
        //     gif: '47494638',
        //     mp4: '00000020',
        //     webm: '1a45dfa3'
        // }

        // var params = {
        //     Bucket: "menacion",
        //     key: req.file.originalname;
        // }

        // //All first characters title should be in uppercase
        // function titleCase(str) {
        //     var splitStr = str.toLowerCase().split(' ');
        //     for (var i = 0; i < splitStr.length; i++) {
        //        // You do not need to check if i is larger than splitStr length, as your for does that for you
        //        // Assign it back to the array
        //        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        //     }
        // // Directly return the joined string
        // return splitStr.join(' '); 
        // }

        // // Check if video is larger than 100mb
        // // if(req.file.size <= 10485760) {
        // //     cloudinary.v2.uploader.upload('public/uploads/tmp/' + req.file.filename, {resource_type: "auto", use_filename: true, unique_filename: false }, function(error, result) {
        // //         if(error) {
        // //             console.log(error);
        // //         } else {
        //             //DATA
        //             var info = req.body.info;
        //             var author = {
        //                 id: req.user.id,
        //                 username: req.user.username
        //             };
        //             var category = req.body.category;
        //             var title = titleCase(req.body.title);
                
        //             // var magic = fs.readFileSync(req.file.filename).toString('hex', 0, 4);

        //             // //Var image
        //             // if(!req.file){
        //             //     var urlTarget = req.body.url;
        //             //     if(urlTarget.indexOf('.jpg') || urlTarget.indexOf('.png') || urlTarget.indexOf('.jpg')) {
        //             //         var image = '<img id="meme-content" src=' + "'" + urlTarget + "'" + '>';
        //             //     }
        //             // } else {
        //                 if(req.file.originalname.indexOf(".jpg" || ".png" || ".jpg1")) {
        //                     var image = '<img class="b-lazy" id="meme-content" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src=' + "'" + result.url + "'" + '>';
        //                 } else if (req.file.originalname.indexOf(".gif" || ".mp4" || ".webm")) {
        //                     // var mp4s = result.url.replace(/\s/g, '');
        //                     var image = '<video class="b-lazy" id="meme-content" src=' + '"' + result.url.replace(".gif", ".mp4") + '"' + 'controls loop preload="metadata">' +
        //                                  '<source id="video-source" src=' + '"' + result.url + '"' + ' type="video/mp4">' +
        //                                 '</video>';
        //                 }

        //                 var newGag = {title: title, image: image, info: info, author: author, category: category};

        //                 Gag.create(newGag, function(err, newlyGag){
        //                     if(err){
        //                         console.log("An error has occur");
        //                         console.log(err);
        //                     } else {
        //                         //redirect to index
        //                         // console.log(req.file.size);
        //                         // console.log(newlyGag);
        //                         fs.unlink('public/uploads/tmp/' + req.file.filename)
        //                         res.redirect("/gags/" + newlyGag.id);

        //                     }
        //                 })
        //             }
        //             //END OF CREATE
        //         }
        //         //END OF ELSE
        //     })
        //     //END OF CLOUDINARY
        // } else {
        //     var info = req.body.info;
        //     var author = {
        //         id: req.user.id,
        //         username: req.user.username
        //     };
        //     var category = req.body.category;
        //     var title = titleCase(req.body.title);
        //     //Var image
        //     if(!req.file){
        //         var image = req.body.url;
        //     } else {

        //         var tmp = '/public/uploads/tmp/' + req.file.filename;

        //         var magic = fs.readFileSync('public/uploads/tmp/' + req.file.filename).toString('hex', 0, 4);

        //         if (magic == MAGIC_NUMBERS.mp4 || magic == MAGIC_NUMBERS.webm) {
        //             // var mp4s = result.url.replace(/\s/g, '');
        //             var image = '<video class="b-lazy" id="meme-content" src=' + '"' + tmp + '"' + 'controls loop preload="metadata">' +
        //                          '<source id="video-source" src=' + '"' + tmp + '"' + ' type="video/mp4">' +
        //                         '</video>';
        //         } else if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) {
        //                     var image = '<img class="b-lazy" id="meme-content" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src=' + "'" + result.url + "'" + '>';
        //         }

        //         var newGag = {title: title, image: image, info: info, author: author, category: category};

        //         Gag.create(newGag, function(err, newlyGag){
        //             if(err){
        //                 console.log("An error has occur");
        //                 console.log(err);
        //             } else {
        //                 //redirect to index
        //                 // console.log(newlyGag);
        //                 res.redirect("/gags/" + newlyGag.id);
        //                 console.log(req.file.size);
        //             }
        //         })
        //     }
        // }
        //END OF UPLOAD
    })
})

//LINK
router.post("/links", function(req, res){
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

    //DATA
    console.log(req.body);
    var info = req.body.info;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    var category = req.body.category;
    var title = titleCase(req.body.title);

    var urlTarget = req.body.url;
        if(urlTarget.indexOf('.jpg') || urlTarget.indexOf('.png') || urlTarget.indexOf('.jpg') || urlTarget.indexOf('.gif') || urlTarget.indexOf('.gifv')) {
            var image = '<img class="b-lazy" id="meme-content" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src=' + "'" + urlTarget + "'" + '>';
        } else if(urlTarget.indexOf('.mp4')) { 
            // var mp4s = result.url.replace(/\s/g, '');
            var image = '<video class="b-lazy" id="meme-content" src=' + '"' + urlTarget + '"' + 'controls loop preload="metadata">' +
                         '<source id="video-source" src=' + '"' + urlTarget + '"' + ' type="video/mp4">' +
                        '</video>';
        }


    var newGag = {title: title, image: image, info: info, author: author, category: category};

    Gag.create(newGag, function(err, newlyGag){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            //redirect to index
            console.log(req.body);
            res.redirect("/gags/" + newlyGag.id);
        }
    })
    
})

//Youtube
router.post("/youtube", function(req, res){
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

    //DATA
    console.log(req.body);
    var info = req.body.info;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    var category = req.body.category;
    var title = titleCase(req.body.title);
    var image = req.body.url;

    var newGag = {title: title, image: image, info: info, author: author, category: category};

    Gag.create(newGag, function(err, newlyGag){
        if(err){
            console.log("An error has occur");
            console.log(err);
        } else {
            //redirect to index
            console.log(req.body);
            res.redirect("/gags/" + newlyGag.id);
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