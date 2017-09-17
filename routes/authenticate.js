var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var multer = require("multer");
var Promise = require("bluebird");
var mkdirp = require("mkdirp");
var expressValidator = require('express-validator');

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
    res.render("register", {errors: false});
})

//NEW
router.post("/register", upload.single('avatar'), function(req, res, next) {

     //Check that the name field is not empty
    req.checkBody('username', 'Escriba el nombre de su usuario').notEmpty(); 
     //Trim and escape the name field. 
    req.sanitize('username').escape();
    req.sanitize('username').trim();

    //Check that the name field is not empty
    req.checkBody('email', 'Escriba su email').notEmpty(); 
    //Trim and escape the name field. 
    req.sanitize('email').escape();
    req.sanitize('email').trim();

    //Check if is is in email format
    req.checkBody('email', 'Chequee la dirreccion de su email').isEmail();

    //Check that the name field is not empty
    req.checkBody('password', 'Escriba su contraseña').notEmpty(); 
     //Trim and escape the name field. 
    req.sanitize('password').escape();
    req.sanitize('password').trim();

    req.getValidationResult().then(function(result) {

        if (!result.isEmpty()) {
          var errors = result.array();
          req.session.errors = errors;
          req.session.success = false;
          res.render("register",  { errors: req.session.errors,
                                  success: req.session.success,
                                  exists: req.session.exists});
          console.log(errors);
        }

        else {

            var newUser = new User({ username: req.body.username, email: req.body.email, avatar: "/default_avatar.png" });
            User.register( newUser, req.body.password, function(err, user){ 
                if(err){
                    req.flash("error", err.message)
                    return res.redirect("register");
                }
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Bienvenido " + user.username)
                    res.redirect("/");
                });
            });
        }
   
    });
})

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