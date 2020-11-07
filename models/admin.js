var mongoose = require("mongoose");
var AdminSchema = new mongoose.Schema({
    email:String,
    password:String,
    phoneNo:String,
    role:String,
    username:String,
    address: String
});
module.exports = mongoose.model("Admin",AdminSchema);