var express = require('express');
const property = require('../models/property');
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

router.get("/property/:id/edit",function(req,res){
    property.findById(req.params.id,function(err,prop){
        res.render("edit",{prop:prop});
    })
});

router.put("/property/:id",function(req,res){
    var data=req.body.Property;
    property.findByIdAndUpdate(req.params.id,data,function(err,prop){
        if(err)
        {
            console.log(err);
            res.redirect("/owner");
        }
        else
        {
            res.redirect("/property/"+req.params.id);
        }
    })
});

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
