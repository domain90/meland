var express = require("express");
var router = express.Router({mergeParams: true});
var Gag = require("../models/gags.js");
var Comment = require("../models/comments.js");
var Reply   = require("../models/reply.js");
//====================================
//COMMENTS
//====================================
// router.post("/gags/:id", function(req, res){
//     Gag.findById(req.params.id, function(err, gag){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("It works");
//         }
//     })
// })


router.post("/gags/:id", isLoggedIn, function(req, res) {
    //Lookup campground using ID
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
          // var newComment = new Comment();
          // newComment.author.id       =req.user.id;
          // newComment.author.username =req.user.username;
          // newComment.author.avatar   =req.user.avatar;
          // newComment.text            =req.body.comment.text;
         
          // gag.comments.push(newComment);
          // gag.save();

          // newComment.save(function(err, newComment){
          //   if(err){
          //     console.log(err)
          //   } else {
          //     // res.json(newComment);
          //     res.redirect("/gags/" + gag._id);
          //   }
          // });
        }
     })
})

router.post("/gags/:id/comment/:idcomment/reply", function(req, res){
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


//Middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;