var mongoose = require("mongoose");
var OwnerSchema = new mongoose.Schema({
    email:String,
    role:String,
    password:String,
    phoneNo:String,
    username:String,
    address: String
});
module.exports = mongoose.model("Owner",OwnerSchema);