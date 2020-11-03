var express = require("express");
var app = express();
var methodOverride= require("method-override");
var bodyParser = require("body-parser");
var User = require('./models/user');
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

//main page
app.get("/main",function(req,res){
    res.render("main");
});

// handle Sign Up logic
app.post("/register",function(req,res){
    var newUser = {username:req.body.username,role:req.body.role,email:req.body.email,phoneNo:req.body.phoneNo};
    console.log(newUser);
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            res.send(err);
           return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/main");
        });
    });
});


//Login Page
app.get('/login',function (req,res){
    // console.log(req);
    res.render("login");
});

// handling login logic
app.post("/login",passport.authenticate("local",
{
    successRedirect:"/main",
    failureRedirect:"/login"
}),function(req,res){
    // console.log(req.body.username);
});

// logout route
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/main");
});

app.listen(app.get("port"));