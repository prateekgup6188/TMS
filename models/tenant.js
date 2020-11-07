var mongoose = require("mongoose");
var TenantSchema = new mongoose.Schema({
    email:String,
    password:String,
    phoneNo:String,
    username:String,
    income:{type: String,default:"15000"},
    role:String,
    members:{type:String,default: "4"},
    house:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref :"Property"
            }
    }
});
module.exports = mongoose.model("Tenant",TenantSchema);