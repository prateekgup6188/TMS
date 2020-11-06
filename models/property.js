var mongoose = require("mongoose");
var PropertySchema = new mongoose.Schema({
    room:String,
    createdAt: { type:Date,default:Date.now },
    address:String,
    status:String,
    rent:String,
    image:String,
    username: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Owner"
        }
    }
});
module.exports = mongoose.model("Property",PropertySchema);