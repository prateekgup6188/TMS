var express = require('express');
const Property = require('../models/property');
var router = express.Router();

router.get("/:id/edit",function(req,res){
    Property.findById(req.params.id,function(err,prop){
        res.render("edit",{prop:prop});
    })
});

router.put("/:id",function(req,res){
    var data=req.body.property;
    Property.findByIdAndUpdate(req.params.id,data,function(err,prop){
        if(err)
        {
            console.log(err);
            res.redirect("back");
        }
        else
        {
            req.flash("success","Property Successfully Updated!!")
            res.redirect("/property/"+req.params.id);
        }
    })
});

router.delete('/:id',function (req,res){
    Property.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Can't reove this property!");
            console.log(err);
        }else{
            req.flash("success","Property Successfully Removed!!");
            res.redirect('back');
        }
    });
});
module.exports = router;