var mongoose = require('mongoose');
var Owner = require('../models/owner');
function addOwner(req,callback){
    Owner.create(req.body.property,function(err,newOwner){
        if(err){
            return callback(err);
        }
        else{
            newOwner.username = newOwner._id;
            newOwner.author.id=req.params.id;
            newOwner.save();
            console.log(newOwner);
            return callback(null,newOwner);
        }
   });
}

function removeOwner(req,callback){
    Owner.findByIdAndRemove(req.params.id,function (err){
        if(err){
            return callback(err);
        }
        else{
            return callback(null);
        }
    });
}

module.exports ={
    addOwner,
    removeOwner
}