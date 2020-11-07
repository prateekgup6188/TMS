var express = require('express');
const Property = require('../models/property');
var Tenant=require('../models/tenant');

var router = express.Router();
var { check,validationResult } = require('express-validator');

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
            res.render("ViewProperty",{property:data});
        }
    });
});


router.get('/:id1/property/:id',[
    check('id1',"id1 must be valid").not().isEmpty()
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
            res.render("showproperty",{property:data});
        }
    })
});


router.get('/:id/edit',function(req,res){
    Tenant.findById(req.params.id,function(err,data){
        console.log(data);
        res.render("edittenant",{data:data});
    })
});


router.put('/:id/edit',function(req,res){
    var data=req.body.tenant;
    Tenant.findByIdAndUpdate(req.params.id,data,function(err,newdata){
        if(err)
        {
            console.log(err);
            res.redirect("/tenant/"+req.params.id);
        }
        else
        {
            console.log(newdata);
            res.redirect("/tenant/"+req.params.id);
        }
    })
});

module.exports = router;
