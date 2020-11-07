var express = require('express');
const Property = require('../models/property');
const Owner = require('../models/owner');
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
            res.redirect('/owner/'+req.params.id);
        }
    });
})

router.get("/:id/property",function(req,res){
    Property.find({},function(err,property){
        if(err){
            console.log(err);
        }else{
            console.log(property);
            var prop=[];
            property.forEach(function(data){
                if((data.author.id).toString()==req.params.id)
                {
                    prop.push(data);
                }
            })
            res.render('ViewOwnerProperties',{property:prop,owner_id:req.params.id})
        }
    });
});


router.get('/:id1/property/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.redirect("back");  
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
                    res.render("viewownerproperty",{property:data,owner:owner});
                }
            });
        }
    })
});


module.exports = router;
