var express = require('express');
const Property = require('../models/property');
var Tenant=require('../models/tenant');
var {
    check,
    validationResult
} = require('express-validator');

var router = express.Router();
var { check,validationResult } = require('express-validator');
const Owner = require('../models/owner');
const Notifications = require('../models/notifications');

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
        Tenant.findById(req.params.id1,function(err,tenant){
            if(err){
                console.log(err);
            }else{
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
                                res.render("showproperty",{property:data,owner:owner,tenant:tenant});
                            }
                        });
                    }
                })
            }
    });
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
                    req.flash("success",'Property Successfully Booked!!');
                    res.redirect("/tenant/"+req.params.id);
                    }
                });
        }
    });
});

router.put('/:id/leave/:id1',function(req,res){
    Property.findById(req.params.id1,function(err,prop){
        if(err){
            console.log(err);
        }else{
            Tenant.findById(req.params.id,function(err,tenant){
                if(err){
                    console.log(err);
                }else{            
                    prop.status="Vacant";
                    prop.save();
                    tenant.house.id=null;
                    tenant.save();
                    req.flash("success","Property successfully left!!");
                    res.redirect("back");
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
            if(data.house.id!=null)
            {
            Property.findById(data.house.id,function(err,property){
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render("payment",{data:data,property:property});
                }
            });
            }else{
                req.flash("error","No property booked yet!");
                res.redirect("back");
            }
        }
    });
});

router.post('/:id/pay',[
   check('name',"Invalid Card Holder Name").isLength({min:3,max:30}).matches(/^[A-Za-z\s]+$/),
   check('card_number',"Invalid Card Number").isLength({min:16,max:16}),
   check('cvv','Invalid CVV').isLength({min:3,max:3})
],function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        Tenant.findById(req.params.id,function(err,tenant){
            if(err){
                console.log(err);
            }else{
                Property.findById(tenant.house.id,function(err,property){
                    if(err){
                        console.log(err);
                    }else
                    {
                        return res.render("payment", {
                            data:tenant,property:property,alert
                        });
                    }
                });
            }
        })
    } else {
        Tenant.findById(req.params.id,function(err,tenant){
            if(err){
                console.log(err);
            }else{
                Property.findById(tenant.house.id,function(err1,property){
                    if(err1){
                        console.log(err1);
                    }else{
                        Owner.findById(property.author.id,function(err2,owner){
                            if(err2){
                                console.log(err2);
                            }else{
                                var mssg="Rent of Rs "+property.rent+" received from "+tenant.username;
                                var obj = {
                                    text : mssg.toString(),
                                }
                                Notifications.create(obj,function(err3,notification){
                                    if(err3){
                                        console.log(err3);
                                    }else{
                                        console.log("Message is "+notification);
                                        owner.notifications.push(notification);
                                        owner.save();                                   
                                        req.flash("success","Payment Successful");
                                        res.redirect("/tenant/"+req.params.id);
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
