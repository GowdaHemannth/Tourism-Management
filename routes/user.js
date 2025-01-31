const express=require("express");
const router=express.Router();
const User= require("../../Data/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy=require("passport-local");
const path=require("path");
const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));


const sessionOptions ={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,
    }
  };
  
  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(User.authenticate));
   passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());
  
   app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
  })
  

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
         const registeredUser =  await User.register(newUser,password);   
         console.log(registeredUser);  
         req.flash("success","Welcome to GO Pravasa");
         res.redirect("/listings");
    }
    catch(err){
       req.flash("error",err.message);
       res.redirect("/signup");
    }
  
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});



router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/listings');
  });
  
module.exports=router;


//passport.authenticate('local', {
 // successReturnToOrRedirect: '/listings',
 // failureRedirect: '/login',
  ///keepSessionInfo: true
//})