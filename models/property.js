var mongoose = require("mongoose");
var PropertySchema = new mongoose.Schema({
    room:Number,
    createdAt: { type:Date,default:Date.now },
    address:String,
    status:String,
    rent:Number,
    image:String,
    username: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Owner"
        },
        username: String
    }
});
module.exports = mongoose.model("Property",PropertySchema);