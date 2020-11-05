var mongoose = require('mongoose');
const Property = require('../models/property');
function addProperty(req,callback){
   Property.create(req.body.property,function(err,newProperty){
        if(err){
            return callback(err);
        }
        else{
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