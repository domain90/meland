var express    = require("express");
var router     = express.Router({mergeParams: true});
var Gag        = require("../models/gags.js");
var Comment    = require("../models/comments.js");
var Reply      = require("../models/reply.js");
var middleware = require("../middleware/index.js");
//====================================
//COMMENTS
//====================================
//POST COMMENT
router.post("/gags/:id", middleware.isLoggedIn, function(req, res) {
    //Lookup gag using ID
    Gag.findByIdAndUpdate(req.params.id, { $inc: {commentsNumber: 1} }).exec (function(err, gag){
        if(err){
           console.log(err);
        } else {
          // console.log(gag._id)
          // Create new comment
          Comment.create(req.body.comment, function(err, comment){
            if(err){
              console.log(err)
            } else {
              // console.log(req.body);
              comment.author.id         = req.user.id;
              comment.author.username   = req.user.username;
              comment.author.avatar     = req.user.avatar;
              // comment.text              = req.body.comment.text;
              //Connect new comment to gag
              comment.save();
              gag.comments.push(comment)
              gag.save()
              //Redirect
              // res.redirect('back')
              // res.send( req.body.comment );
              res.json(comment);
              console.log(req.body.comment)
              // res.end();
              // res.redirect("/gags/" + gag._id);
            }
          })
        }
     })
})
//POST REPLY
router.post("/gags/:id/comment/:idcomment/reply", middleware.isLoggedIn, function(req, res){
  Gag.findByIdAndUpdate(req.params.id, { $inc: {commentsNumber: 1} }).exec (function(err, gag){
      if(err){
         console.log(err);
      } else {
        Comment.findById(req.params.idcomment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            Comment.create(req.body.comment, function(err, commentChildren){
              if(err){
                console.log(err)
              } else {
                // console.log(req.body);
                commentChildren.author.id         = req.user.id;
                commentChildren.author.username   = req.user.username;
                commentChildren.author.avatar     = req.user.avatar;
                // comment.text              = req.body.comment.text;
                //Connect new comment to gag
                commentChildren.save();
                comment.commentChildren.push(commentChildren);
                // reply.parentComment.push(comment);
                comment.save();
                gag.save();
                //Redirect
                // res.redirect('back')
                // res.send( req.body.comment );
                res.json(commentChildren);
                console.log(comment)
                }
            })
          }
        })
      }
    })
})
//EDIT
router.get("/gags/:id/:idcomment/edit", middleware.checkCommentOwnership,function(req, res){
  Comment.findById(req.params.idcomment).exec(function(err, foundComment){
      if(err){
         res.redirect("/gags/:id")
      } else {
         res.render("comments/edit", {gag_id: req.params.id, comment: foundComment})
      }
    })
})

//UPDATE
router.put("/gags/:id/:idcomment", middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndUpdate(req.params.idcomment, req.body.comment).exec(function(err, updatedcomment){
      if(err){
         res.redirect("back")
      } else {
         res.redirect("/gags/" + req.params.id)
      }
    })
})

//DESTROY 
router.delete("/gags/:id/:idcomment", middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndRemove(req.params.idcomment).exec(function(err){
        if(err){
            res.redirect('back')
        } else {
            //show more info in a template
            res.redirect("/gags/" + req.params.id);
        }
     })
})

//Middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;