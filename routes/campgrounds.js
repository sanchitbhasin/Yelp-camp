var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");

//show all the camps
router.get("/", function(req, res){
    //this command will find all the data in db and pass as allcamps
    Campground.find({}, function(err, allcamps){
        if(err){
            console.log("something went wrong !!");
        } else {
            res.render("campgrounds/index", {camps: allcamps});
        }
    });
});

//post a new camp
router.post("/", middleware.isloggedin, function(req, res){
    var name = req.body.cname;
    var img = req.body.cimage;
    var price = req.body.cprice;
    var desc = req.body.cdescription;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, image: img, description: desc, author: author, price: price};
    //create a new data entry to db
    Campground.create(newCamp, function(err, newlycreated){
        if(err){
            console.log("something went wrong Oops!!");
        } else {
            //redirect back to camps page
            res.redirect("/camps");
        }
    });
});

//show form to add new camp
router.get("/new", middleware.isloggedin, function(req, res){
    res.render("campgrounds/new");
});

//info of a camp
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, thatcamp){
        if(err || !thatcamp){
            req.flash("error", "oops!!");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {camp: thatcamp});
        }
    });
});

//edit camps
router.get("/:id/edit", middleware.campOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, thatcamp){
        res.render("campgrounds/edit", {camp: thatcamp});
    });
});

//update camps
router.put("/:id", middleware.campOwnership, function(req, res){
    //find and update the correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedcamp){
        if(err){
            console.log(err);
            res.redirect("/camps");
        } else {
            res.redirect("/camps/" + req.params.id);
        }
    });
    //redirect somewhere
});

//delete a camp
router.delete("/:id", middleware.campOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/camps");
    });
});

//middleware
//isloggedin

//middleware for ownership
//campOwnership

module.exports = router;