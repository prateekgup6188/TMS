var express = require('express');
const tenant = require('../models/tenant');
const owner =require('../models/owner');
var router = express.Router();
var fun = require('../services/owner');
var { check,validationResult } = require('express-validator');

router.get('/admin/addOwner/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    res.render("addowner",{admin_id: req.params.id});
});

router.post('/admin/addOwner/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req,res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    console.log('inside post add property');
    fun.addOwner(req, function(err,result){
       if(err){
           req.flash("error","Some error occured!");
           console.log(err);
       }
       else{
            req.flash("success","Property Successfully Added!!");
            res.redirect('/addowner/'+req.params.id);
       }

   })
});

router.delete('/admin/removeOwner/:id',function(req,res){
    fun.removeOwner(req,function(err){
        let message;
        if(err){
            message="Some error occured!";
            res.send(err);
        }
        else{
            message="Property Successfully Removed";
            res.redirect('/admin/'+req.params.id,{message});
        }
    });
})


module.exports = router;
