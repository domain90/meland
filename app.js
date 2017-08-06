var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Gag = require("./models/gags");
var Comment = require("./models/comments");
var seeddb = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var Reply = require("./models/reply");
var exsession = require("express-session");
require('./config/passport.js')(passport);
var Promise = require("bluebird");

/////////////////////////////////////
//Server Config
/////////////////////////////////////
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
// seeddb();

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
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

/////////////////////////////////////
// Use Routes
/////////////////////////////////////
app.use(authenticateRoutes);
app.use('/', gagsRoutes);
app.use(commentsRoutes);
app.use('/profile', profile);

/////////////////////////////////////
//Listen Event
/////////////////////////////////////
app.listen(process.env.PORT || 8000, function(){
    console.log("Yelpcamp Started!");
})