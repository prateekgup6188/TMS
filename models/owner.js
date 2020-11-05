var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var OwnerSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phoneNo:Boolean,
    username:String,
    address: String
});
OwnerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Owner",OwnerSchema);