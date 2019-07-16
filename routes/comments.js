var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//form for new comment
router.get("/new", middleware.isloggedin, function(req, res){
    Campground.findById(req.params.id, function(err, thatcamp){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: thatcamp});
        }
    });
});

//post a new comment at a camp
router.post("/", middleware.isloggedin, function(req, res){
    Campground.findById(req.params.id, function(err, thatcamp){
        if(err){
            console.log(err);
            res.redirect("/camps");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id  to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    thatcamp.comments.push(comment);
                    thatcamp.save();
                    req.flash("success", "successfully added comment")
                    res.redirect("/camps/" + thatcamp._id);
                }
            });
        }
    });
});

//edit comment
router.get("/:cid/edit", middleware.commentOwnership, function(req, res){
    Comment.findById(req.params.cid, function(err, thatcomment){
        if(err || !thatcomment){
            req.flash("error", "comment not found");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: thatcomment});
        }
    });
});

//update comment
router.put("/:cid", middleware.commentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, thatcamp){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/camps/" + req.params.id);
        }
    });
});

//delete comment
router.delete("/:cid", middleware.commentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.cid, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        req.flash("success", "comment deleted");
        res.redirect("/camps/" + req.params.id);
    });
});

//middleware
//isloggedin

//middleware
//commentOwnership

module.exports = router;