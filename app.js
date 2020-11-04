var express = require("express");
var app = express();
var methodOverride= require("method-override");
var bodyParser = require("body-parser");
var User = require('./models/user');
var Tenant = require('./models/tenant');
var Owner = require('./models/owner');
var Property = require('./models/property');

var { check,validationResult } = require('express-validator');
var Validator = require('validatorjs');
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/TMS",{
useUnifiedTopology:true,
useNewUrlParser:true,
useCreateIndex:true
}).then(() => console.log("DB Connected!"))
.catch(err => {
    console.log("DB Connection Error : $(err.message)");
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.set("port",process.env.PORT||8080);

// passport configuration
app.use(require("express-session")({
    secret:"Nature is Ultimate!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    next();
});


// Landing Page
app.get("/",function(req,res){
    res.render('landing');
});

// SignUp Page
app.get("/register",function(req,res){
    res.render('register');
});

// handle Sign Up logic
app.post("/register",[
    check('username',"Invalid Username").isLength({min:3}).custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;
        return true;
    }),
    check('password',"Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    check('email',"Invalid Email").isEmail().normalizeEmail(),
    check('phoneNo',"Invalid Phone Number").custom(value => {
        if (!value.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)) return false;
        return true;
    }),
    check('role',"Role must be Admin/Tenant/Manager/Owner").isIn(['Admin','Tenant','Manager','Owner'])
],function(req,res){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array();
        return res.render("register",{alert});  
    }
    var newUser = {username:req.body.username,role:req.body.role,email:req.body.email,phoneNo:req.body.phoneNo};
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            res.send(err);
           return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.render("landing");
        });
    });
});


// main login page
app.get("/login",function(req,res){
    res.render('login');
});

//Tenant Page
app.get('/tenant',function(req,res){
    res.render("tenant");
})

//Tenant Login Page
app.get('/login/tenant',function (req,res){
    // console.log(req);
    res.render("login_tenant");
});

// handling Tenant login logic
app.post("/login/tenant",[
    check('username',"Invalid Username").isLength({min:3}).custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;
        return true;
    }),
    check('password',"Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]
 ,function(req,res, next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_tenant",{alert});  
    }
    else{
        console.log("Inside Else--------------");
        passport.authenticate('local', function(err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (! user) {
                const alert = [
                    {
                      value: req.body.username,
                      msg: 'Invalid Username/Password',
                      param: 'username',
                      location: 'body'
                    }
                  ]
            //   return res.send(401,{ success : false, message : 'authentication failed' });
            return res.render("login_tenant",{alert})
            }
            req.login(user, function(err){
              if(err){
                return next(err);
              }
              return res.render("tenant");        
            });
          })(req, res, next);
    } 
});


//Owner Page
app.get('/owner',function(req,res){
    res.render('owner');
})

//Owner Login Page
app.get('/login/owner',function(req,res){
    res.render("login_owner");
});

//handling Owner login logic
app.post("/login/owner",[
    check('username',"Invalid Username").isLength({min:3}).custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;
        return true;
    }),
    check('password',"Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]
 ,function(req,res, next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_owner",{alert});  
    }
    else{
        console.log("Inside Else--------------");
        passport.authenticate('local', function(err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (! user) {
                const alert = [
                    {
                      value: req.body.username,
                      msg: 'Invalid Username/Password',
                      param: 'username',
                      location: 'body'
                    }
                  ]
            //   return res.send(401,{ success : false, message : 'authentication failed' });
            return res.render("login_owner",{alert})
            }
            req.login(user, function(err){
              if(err){
                return next(err);
              }
              return res.render("owner");        
            });
        })(req, res, next);
    } 
});


//Admin Login Page
app.get("/admin",function(req,res){
    res.render("admin");
})

//Admin Login Page
app.get('/login/admin',function(req,res){
    res.render("login_admin");
});

//handling Admin login logic
app.post("/login/admin",[
    check('username',"Invalid Username").isLength({min:3}).custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;
        return true;
    }),
    check('password',"Invalid Password").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]
 ,function(req,res, next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array();
        console.log("error", alert);
        return res.render("login_admin",{alert});  
    }
    else{
        console.log("Inside Else--------------");
        passport.authenticate('local', function(err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (! user) {
                const alert = [
                    {
                      value: req.body.username,
                      msg: 'Invalid Username/Password',
                      param: 'username',
                      location: 'body'
                    }
                  ]
            //   return res.send(401,{ success : false, message : 'authentication failed' });
            return res.render("login_admin",{alert})
            }
            req.login(user, function(err){
              if(err){
                return next(err);
              }
              return res.render("admin");        
            });
        })(req, res, next);
    } 
});

// logout route
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
  });