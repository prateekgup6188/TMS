var mongoose = require("mongoose");
var OwnerSchema = new mongoose.Schema({
    email:String,
    role:String,
    password:String,
    phoneNo:String,
    username:String,
    address: String,
    notifications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Notification"
        }
    ]
});
module.exports = mongoose.model("Owner",OwnerSchema);