var express = require('express');
const property = require('../models/property');
var router = express.Router();
var owner = require('../services/owner');
var { check,validationResult } = require('express-validator');

router.get('/addProperty/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    res.render("addProperty",{owner_id: req.params.id});
})

router.post('/addProperty/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req,res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    console.log('inside post add property');
    owner.addProperty(req, function(err,result){
       if(err){
           req.flash("error","Some error occured!");
           console.log(err);
       }
       else{
            req.flash("success","Property Successfully Added!!");
            res.redirect('/owner/'+req.params.id);
       }

   })
})


router.delete('/removeProperty/:id',function(req,res){
    owner.removeProperty(req,function(err){
        let message;
        if(err){
            message="Some error occured!";
            res.send(err);
        }
        else{
            message="Property Successfully Removed";
            res.redirect('/owner',{message});
        }
    });
})


module.exports = router;
