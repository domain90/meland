// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1087922281309246', // your App ID
        'clientSecret'  : 'f15b80955ebe88c6e3cc2e76a23c1812', // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback',
        'profileFields' : ['id', 'displayName', 'picture.type(large)', 'emails'],
        'passReqToCallback' : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },

    'googleAuth' : {
        'clientID'      : '869259037617-40u571mmi303scscptrvt2rjloa7daap.apps.googleusercontent.com',
        'clientSecret'  : 'np-wGW-VLPrsWUW1QFOhRhF7',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback',
        'profileFields' : ['id', 'displayName', 'picture.type(large)', 'emails'],
        'passReqToCallback' : true
    }

};
