// app/routes.js
var express = require('express');
var router = express.Router();
var passport = require('passport');


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


module.exports = router;
