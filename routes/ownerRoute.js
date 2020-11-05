var express = require('express');
var router = express.Router();
var Owner = require('../services/owner');

router.get('/addProperty/:id',(req, res) =>{
    res.render("addproperty.ejs");
})

router.post('/addProperty/:id',(req,res) => {
   Owner.addProperty(req, function(err,res){
       let message;
       if(err){
           message="Some error occured!";
           res.send(message);
       }
       else {
            message="Property Successfully Added";
            res.redirect('/owner',{message});
       }

   })
})

router.delete('/removeProperty/:id',function(req,res){
    Owner.removeProperty(req,function(err,res){
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
