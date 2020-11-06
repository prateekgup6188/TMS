var mongoose = require('mongoose');
var Owner = require('../models/owner');
const Property = require('../models/property');
function addProperty(req,callback){
   Property.create(req.body.property,function(err,newProperty){
        if(err){
            return callback(err);
        }
        else{
            newProperty.username = newProperty._id;
            newProperty.author.id=req.params.id;
            newProperty.author.username = req.user.username;
            console.log("ID is -------> ",req.params.id);
            Owner.findById(req.params.id, function(err,owner){
                if(err){
                    console.log("Owner Not found");
                }else{
                    console.log(owner);
                }
            })
            newProperty.save();
            console.log(newProperty);
            return callback(null,newProperty);
        }
   });
}

function removeProperty(req,callback){
    Property.findByIdAndRemove(req.params.id,function (err){
        if(err){
            return callback(err);
        }
        else{
            return callback(null);
        }
    });
}

module.exports ={
    addProperty,
    removeProperty
}