var express = require("express");
var app = express();
var methodOverride= require("method-override");
var bodyParser = require("body-parser");
var User = require('./models/user');
var { check,validationResult } = require('express-validator');
var Validator = require('validatorjs');
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
app.use(bodyParser.urlencoded({extended:false}));
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

//main page
app.get("/main",function(req,res){
    res.render("main");
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
            res.render("main");
        });
    });
});


//Login Page
app.get('/login',function (req,res){
    res.render("login");
});

// handling login logic
app.post("/login",[
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
        return res.render("login",{alert});  
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
            return res.render("login",{alert})
            }
            req.login(user, function(err){
              if(err){
                return next(err);
              }
              return res.render('main');        
            });
          })(req, res, next);
    } 
});

// logout route
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/main");
});

app.listen(app.get("port"));