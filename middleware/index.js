//middleware file
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.campOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, thatcamp){
            if(err || !thatcamp){
                req.flash("error", "Camp not found");
                console.log(err);
                res.redirect("back");
            } else {
                //does user own the campground?
                if(thatcamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You should be Logged In first");
        res.redirect("back");
    }
}

middlewareObj.commentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid, function(err, thatcomment){
            if(err){
                req.flash("error", "comment not found!");
                res.redirect("back");
            } else {
                //does user own the comment
                if(thatcomment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "you do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

middlewareObj.isloggedin = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In first");
    res.redirect("/login");
}

module.exports = middlewareObj;