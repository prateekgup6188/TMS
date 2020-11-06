var mongoose = require("mongoose");
var TenantSchema = new mongoose.Schema({
    email:String,
    password:String,
    phoneNo:String,
    username:String,
    income:Number,
    members:Number,
    house:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref :"Property"
            }
    }
});
module.exports = mongoose.model("Tenant",TenantSchema);