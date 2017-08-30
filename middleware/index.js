var Gag = require("../models/gags.js");
var Comment = require("../models/comments.js");
var middlewareObj = {};

middlewareObj.checkGagOwnership = function(req, res, next) {
      if(req.isAuthenticated()){
        Gag.findById(req.params.id).exec(function(err, foundGag){
            if(err){
            	req.flash("error", "No se encuentra el gag")
                res.redirect('back')
            } else {
                //does the current usesr own the post
                if(foundGag.author.id.equals(req.user.id)) {
                   next()
                }
                else {
                   req.flash("error", "No tiene permiso para realizar esto")
                   res.redirect('back')
                }
            }
        })
    } else {
    	req.flash("error", "Debe ingresar su cuenta")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id).exec(function(err, foundComment){
            if(err){
            	req.flash("error", "No se encuentra el comentario")
                res.redirect('back')
            } else {
                //does the current usesr own the post
                if(foundComment.author.id.equals(req.user.id)) {
                   next()
                }
                else {
                   req.flash("error", "No tiene permiso para realizar esto")
                   res.redirect('back')
                }
            }
        })
    } else {
    	req.flash("error", "Debe ingresar su cuenta")
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Debe ingresar su cuenta")
    res.redirect("/login");

}

module.exports = middlewareObj;