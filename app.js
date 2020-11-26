var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var Tenant = require('./models/tenant');
var Owner = require('./models/owner');
var Admin = require('./models/admin');
var Property = require('./models/property');
var flash = require('connect-flash');
var {
    check,
    validationResult
} = require('express-validator');
var Validator = require('validatorjs');
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/TMS", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log("DB Connected!"))
    .catch(err => {
        console.log("DB Connection Error : $(err.message)");
    });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Nature is Ultimate!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());

app.set("port", process.env.PORT || 8080);


app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


// Landing Page
app.get("/", function (req, res) {
    res.render('landing');
});

// SignUp Page
app.get("/register", function (req, res) {
    res.render('register');
});

// handle Sign Up logic
app.post("/register", [
    check('username', "Invalid Username").isLength({
        min: 3
    }).custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;
        return true;
    }),
    check('password', "Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    check('email', "Invalid Email").isEmail().normalizeEmail(),
    check('phoneNo', "Invalid Phone Number").custom(value => {
        if (!value.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)) return false;
        return true;
    }),
    check('role', "Role must be Admin/Tenant/Owner").isIn(['Admin', 'Tenant', 'Manager', 'Owner'])
], function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("register", {
            alert
        });
    } else {
        var newUser = {
            username: req.body.username,
            role: req.body.role,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            password:req.body.password
        };
        if (req.body.role == 'Tenant') {
            Tenant.create(newUser,function (err, user) {
                if (err) {
                    console.log("Inside Error");
                    res.send(err);
                    return res.redirect("/register");
                }else{
                    req.flash("success", "User Successfully Registered!!");
                    res.redirect("/tenant/" + user._id);
                }
            });
        }
        if (req.body.role == 'Owner') {
            Owner.create(newUser,function (err, user) {
                if (err) {
                    console.log("Inside Error");
                    res.send(err);
                    return res.redirect("/register");
                }else{
                    req.flash("success", "User Successfully Registered!!");
                    res.redirect("/owner/" + user._id);
                }
            });
        }
        if (req.body.role == 'Admin') {
            Admin.create(newUser,function (err, user) {
                if (err) {
                    console.log("Inside Error");
                    res.send(err);
                    return res.redirect("/register");
                }else{
                    req.flash("success", "User Successfully Registered!!");
                    res.redirect("/admin/" + user._id);
                }
            });
        }
    }
});


// Main login page
app.get("/login", function (req, res) {
    res.render('login');
});


//Tenant Login Page
app.get('/login/tenant', function (req, res) {
    // console.log(req);
    res.render("login_tenant");
});

// handling Tenant login logic
app.post("/login/tenant", [
    check('username', "Invalid Username").isLength({
        min: 3
    }),
    check('password', "Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
], function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_tenant", {
            alert
        });
    } else {
        Tenant.findOne({username:req.body.username},function(err,user){
            if(err||user==null){
                req.flash("error","Invalid login details");
                res.redirect('/login/tenant');
                console.log(err);
            }else{
                res.redirect('/tenant/'+user._id);
            }
        });
    }
});

//Tenant Page
app.get('/tenant/:id', function (req, res) {
    Tenant.findById(req.params.id,function(err,tenant){
        if(err){
            console.log(err);
        }else{
            if(tenant.house.id){
            const prop_id=tenant.house.id;
            Property.findById(prop_id,function(err,property){
                if(err){
                    console.log(err);
                }else{
                    console.log("Property ID is: ",property.id);
                    res.render("tenant",{property:property,tenant_id:req.params.id});
                }
            })
        }else{
            res.render("tenant",{property:null,tenant_id:req.params.id});
        }
        }
    });
});


//Owner Login Page
app.get('/login/owner', function (req, res) {
    res.render("login_owner");
});

//handling Owner login logic
app.post("/login/owner", [
    check('username', "Invalid Username").isLength({
        min: 3
    }),
    check('password', "Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
], function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_owner", {
            alert
        });
    } else {
        Owner.findOne({username:req.body.username},function(err,user){
            if(err||user == null){
                req.flash("error","Invalid login details");
                res.redirect('/login/owner');
                console.log(err);
            }else{
                res.redirect('/owner/'+user._id);
            }
        });
    }
});


//Owner Page
app.get('/owner/:id', function (req, res) {
    res.render('owner', {
        owner_id: req.params.id
    });
})


//Admin Login Page
app.get('/login/admin', function (req, res) {
    res.render("login_admin");
});

//handling Admin login logic

app.post("/login/admin", [
    check('username', "Invalid Username").isLength({
        min: 3
    }),
    check('password', "Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
], function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_admin", {
            alert
        });
    } else {
        Admin.findOne({username:req.body.username},function(err,user){
            if(err||user==null){
                req.flash("error","Invalid login details");
                res.redirect('/login/admin');
                console.log(err);
            }else{
                res.redirect('/admin/'+user._id);
            }
        });
    }
});


//Admin Page
app.get("/admin/:id", function (req, res) {
    Owner.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            Tenant.find({}, function (err, data1) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log("After tenant/owner Details",data,data1)
                    res.render('admin', {
                        admin_id: req.params.id,
                        owners: data,
                        tenants: data1
                    });
                }
            });
        }
    });
});

app.get('/admin/:id/viewall',function(req,res){
    Property.find({},function(err,prop){
        if(err){
            console.log(err);
        }else{
            res.render('viewAll',{prop:prop,admin_id:req.params.id});
        }
    });
});

app.get('/admin/:id/viewall/:id1',function(req,res){
    Property.findById(req.params.id1,function(err,prop){
        if(err){
            console.log(err);
        }else{
            Owner.findById(prop.author.id,function(err,owner){
                if(err){
                    console.log(err);
                }else{
                    res.render('showAll',{property:prop,owner:owner});
                }
        });
        }
    });
});

// logout route
app.get("/logout", function (req, res) {
    //req.logOut();
    res.redirect("/");
});

// Property Shower
app.get("/property/:id", function (req, res) {
    res.render("property");
});

const ownerRoutes = require('./routes/ownerRoute');
app.use('/owner', ownerRoutes);

const adminRoutes = require('./routes/adminRoute');
app.use('/admin', adminRoutes);

const tenantRoutes = require('./routes/tenantRoute');
const router = require("./routes/tenantRoute");
app.use('/tenant', tenantRoutes);

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
});