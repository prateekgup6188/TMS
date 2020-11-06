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

module.exports = router;
