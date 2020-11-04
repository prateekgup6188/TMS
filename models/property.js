var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var PropertySchema = new mongoose.Schema({
    room:Number,
    createdAt: { type:Date,default:Date.now },
    address:String,
    status:Boolean,
    rent:Number,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Owner"
        },
        username:String
    },
    buyer:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Tenant"
        },
        username:String
    }
});
PropertySchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Property",PropertySchema);