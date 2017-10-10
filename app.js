var express               = require("express");
var app                   = express();
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var Gag                   = require("./models/gags");
var Comment               = require("./models/comments");
var seeddb                = require("./seeds");
var passport              = require("passport");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User                  = require("./models/user");
var Reply                 = require("./models/reply");
var exsession             = require("express-session");
require('./config/passport.js')(passport);
var Promise               = require("bluebird");
var mongodb               = require('mongodb');
var methodOverride        = require("method-override");
var flash                 = require("connect-flash");
var expressValidator      = require('express-validator');
var cloudinary            = require('cloudinary');
/////////////////////////////////////
//Server Config
/////////////////////////////////////

var uri = "mongodb://domain90:counter333!@clusterme-shard-00-00-bjals.mongodb.net:27017,clusterme-shard-00-01-bjals.mongodb.net:27017,clusterme-shard-00-02-bjals.mongodb.net:27017/test?ssl=true&replicaSet=ClusterMe-shard-0&authSource=admin";

mongoose.connect(uri || "mongodb://localhost/yelp_camp_v6");
// mongodb.MongoClient.connect(uri, function (err, db) {
//     db.close();
// });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressValidator());

cloudinary.config({ 
  cloud_name: 'menacion01', 
  api_key: '941395553812998', 
  api_secret: 'QOiyAix56NUUp7IOAidAhTnchn0' 
});
/////////////////////////////////////
//Require Routes
/////////////////////////////////////
var gagsRoutes 			= require("./routes/gags.js");
var commentsRoutes 		= require("./routes/comments.js");
var authenticateRoutes 	= require("./routes/authenticate.js");
var fbauth 				= require("./routes/fb.js");
var profile             = require("./routes/profile.js");

/////////////////////////////////////
//passport configuration
/////////////////////////////////////
app.use(exsession({
    secret: "This is a cool project",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errormsg    = req.flash("error");
    res.locals.successmsg  = req.flash("success");
    next();
})

/////////////////////////////////////
// Use Routes
/////////////////////////////////////
app.use(authenticateRoutes);
app.use('/', gagsRoutes);
app.use(commentsRoutes);
app.use(profile);

/////////////////////////////////////
// Error Handler
/////////////////////////////////////
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if(req.accepts('html')) {
        res.render('oops', {error: 'The resource you where looking for is not available.'});
        return;
    };

});
app.use(function(err, req, res, next){
    console.log(err);
    // we may use properties of the error object
    // here and next(err) appropriately, or if

    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);

    // respond with html page
    if(req.accepts('html')) {
        res.render('oops', {error: 'Something is broken on our end, email us if this issue persist.'});
        return;
    }

});

/////////////////////////////////////
//Listen Event
/////////////////////////////////////
app.listen(process.env.PORT || 8000, function(){
    console.log("Meland Started!");
})

