var express = require('express');
const Property = require('../models/property');
const Owner = require('../models/owner');
var router = express.Router();
var owner = require('../services/owner');
var { check,validationResult } = require('express-validator');

//add property get route
router.get('/addProperty/:id',[
    check('id',"id must be valid").not().isEmpty()
],(req, res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    res.render("addProperty",{owner_id: req.params.id});
})

//add property post route
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

// show all owner properties
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

// show more about particular owner property
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
                    res.render("showOwnerProperty",{property:data,owner:owner});
                }
            });
        }
    })
});

//Edit Owner Profile
router.get("/:id/edit",[
    check('id',"id must be valid").not().isEmpty()
],(req,res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("login");  
    }
    Owner.findById(req.params.id,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("editowner",{data:data});
        }
    })
});

router.put("/:id/edit",function(req,res){
    var data=req.body.owner;
    Owner.findByIdAndUpdate(req.params.id,data,function(err,new_owner){
        if(err)
        {
            console.log(err);
        }
        else{
            req.flash("success","Profile Successfully Updated!!")
            res.redirect("/owner/"+req.params.id);
        }
    })
})
//Edit Property Get Route
router.get("/:id/property/:id1/edit",function(req,res){
    Property.findById(req.params.id1,function(err,prop){
        if(err){
            console.log(err);
        }else{
        res.render("edit",{prop:prop,owner_id:req.params.id});
        }
    })
});


//Update Property PUT route
router.put("/:id/property/:id1",function(req,res){
    var data=req.body.property;
    Property.findByIdAndUpdate(req.params.id1,data,function(err,prop){
        if(err)
        {
            console.log(err);
            res.redirect("back");
        }
        else
        {
            console.log("Edited Property is :",prop);
            req.flash("success","Property Successfully Updated!!")
            res.redirect("/owner/"+req.params.id+"/property/"+req.params.id1);
        }
    });
});

//Remove Property
router.delete('/:id/property/:id1',function (req,res){
    Property.findByIdAndRemove(req.params.id1,function(err){
        if(err){
            req.flash("error","Can't remove this property!");
            console.log(err);
        }else{
            req.flash("success","Property Successfully Removed!!");
            res.redirect('/owner/'+req.params.id+'/property');
        }
    });
});

//View Notifications
router.get('/:id/notification',function(req,res){
    Owner.findById(req.params.id).populate("notifications").exec(function(err,owner){
        if(err){
            console.log(err);
        }else{
            res.render("viewNotification",{owner:owner});
        }
    })
});

module.exports = router;
