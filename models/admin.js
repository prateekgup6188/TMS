var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var AdminSchema = new mongoose.Schema({
    email:String,
    password:String,
    phoneNo:String,
    username:String,
    address: String
});
AdminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin",AdminSchema);