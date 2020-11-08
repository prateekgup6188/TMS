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
        var prop=[];
            data.forEach(function (property){
                if(property.status=="Vacant")
                {
                    prop.push(property);
                }
            })
            res.render("ViewProperty",{tenant_id:req.params.id,property:prop});
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
                if(err){
                    console.log(err);
                }else{
                    res.render("showproperty",{property:data,owner:owner,tenant_id:req.params.id1});
                }
            });
        }
    })
});

router.get('/:id/edit',function(req,res){
    Tenant.findById(req.params.id,function(err,data){
        console.log(data);
        res.render("edittenant",{tenant_id:req.params.id,data:data});
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

router.put('/:id/property/:id1/book',function(req,res){
    Tenant.findById(req.params.id,function(err,tenant){
        if(err){
            console.log(err);
        }else{
            Property.findById(req.params.id1,function(err,property){
                if(err){
                    console.log(err);
                }else{
                    property.status="Full";
                    tenant.house.id=property._id;
                    tenant.save();
                    property.save();
                    req.flash('Property Successfully Booked!!');
                    res.redirect("/tenant/"+req.params.id);
                    }
                });
        }
    });
});

router.get('/:id/pay',function(req,res){
    Tenant.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(data);
            Property.findById(data.house.id,function(err,property){
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render("payment",{data:data,property:property});
                }
            });
        }
    });
});

router.post('/:id/pay',function(req,res){
    req.flash("success","Payment Successful");
    res.redirect("/tenant/"+req.params.id);
});

module.exports = router;
