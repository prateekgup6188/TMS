var express = require('express');
const Property = require('../models/property');
var Tenant=require('../models/tenant');

var router = express.Router();
var { check,validationResult } = require('express-validator');
const Owner = require('../models/owner');

router.get('/:id/property',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    Property.find({},function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(typeof(data));
            res.render("ViewProperty",{tenant_id:req.params.id,property:data});
        }
    });
});


router.get('/:id1/property/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    Property.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        {
            Owner.findById(data.author.id,function(err,owner){
                console.log("Owner is: ",owner);
                if(err){
                    console.log(err);
                }else{
                    res.render("showproperty",{property:data,owner:owner});
                }
            });
        }
    })
});

router.get('/:id/edit',function(req,res){
    Tenant.findById(req.params.id,function(err,data){
        console.log(data);
        res.render("edittenant",{tenant_id:req.paramms.id,data:data});
    })
});


router.put('/:id/edit',function(req,res){
    var data=req.body.tenant;
    Tenant.findByIdAndUpdate(req.params.id,data,function(err,newdata){
        if(err)
        {
            console.log(err);
            res.redirect('back');
        }
        else
        {
            console.log(newdata);
            req.flash("success","Profile Successfully Updated!!");
            res.redirect("/tenant/"+req.params.id);
        }
    });
});


module.exports = router;
