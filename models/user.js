var mongoose = require("mongoose");
var passsportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passsportLocalMongoose);

module.exports = mongoose.model("User", userSchema);