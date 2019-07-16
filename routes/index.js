var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

//root routes
router.get("/", function(req, res){
    res.render("home");
});

//auth routes
//register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to Yelp-camp " + req.body.username);
            res.redirect("/camps");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/camps",
    failureRedirect: "/login"
}), function(req, res){
});

//logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out!!");
    res.redirect("/camps");
});

//middleware
//isloggedin

module.exports = router;