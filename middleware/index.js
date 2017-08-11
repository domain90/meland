var Gag = require("../models/gags.js");
var Comment = require("../models/comments.js");
var middlerwareObj = {};

middlewareObj.checkGagOwnership = function(req, res, next) {
      if(req.isAuthenticated()){
        Gag.findById(req.params.id).exec(function(err, foundGag){
            if(err){
                res.redirect('back')
            } else {
                //does the current usesr own the post
                if(foundGag.author.id.equals(req.user.id)) {
                   next()
                }
                else {
                   res.redirect('back')
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id).exec(function(err, foundComment){
            if(err){
                res.redirect('back')
            } else {
                //does the current usesr own the post
                if(foundComment.author.id.equals(req.user.id)) {
                   next()
                }
                else {
                   res.redirect('back')
                }
            }
        })
    } else {
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}

module.exports = middlewareObj;