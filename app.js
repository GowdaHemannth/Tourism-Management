const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../Data/listing.js");
const Review=require("../Data/review.js");
const path=require("path");
const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");
const User=require("../Data/user.js")
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));


// defing the session options
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

 
  app.get("/",(req,res)=>{
    res.send("Home page");
  });
  
  // we are craeting a middleware to use a flash
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})







//instead of listing all routers 
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
 app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
 });
 // Middleware to handle an error
 app.use((err,req,res,next)=>{
    let{statusCode=500,message=" HEMANTH!!!!"}=err;
   res.render("error.ejs",{err});
 });
 
app.listen(8080,()=>{
    console.log("server is listeing to port");
}) 

//const validateReview=(req,res,next)=>{
  //  let {error}=reviewSchema.validate(req.body);
  //  if(error){
     //   let errMsg=error.details.map((el)=>el.message).join(",");
   //     throw new ExpressError(400,errMsg);
    //}else{
  //      next();
  // }
///}