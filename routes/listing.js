const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../../Data/listing.js");
const {isLoggedIn}=require("../middleware.js")


router.get("/",wrapAsync(async(req,res)=>{
    const alllistings= await Listing.find({});
   res.render("listings/index.ejs",{alllistings});
   }));
   // new route
   router.get("/new",isLoggedIn,(req,res)=>{
   
    res.render("listings/new.ejs");

   });
  
   // show route
   router.get("/:id",wrapAsync(async(req,res)=>{
       let {id}=req.params;
     const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Place doent Exist!!");
      res.redirect("/listings");
    }
       res.render("listings/show.ejs",{listing});
   }));
   // create route
   router.post("/",wrapAsync(async(req,res,next)=>{
  
    const newlisting= new Listing(req.body.listing);
     await newlisting.save();
     req.flash("success","New Place is Addedd!!");
    res.redirect("/listings");
    }));
    // Edit route
    router.get("/:id/edit",wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing= await Listing.findById(id);
         res.render("listings/edit.ejs",{listing});
    }));
     // Update Route
     router.put("/:id",wrapAsync(async(req,res)=>{
          let {id}=req.params;
          req.flash("success"," Place is UpdateD!!!");
       res.redirect(`/listings/${id}`);
     }));
     //Delete Route
     router.delete("/:id",wrapAsync(async(req,res)=>{
        let {id}=req.params;
        let deltedlisting=await Listing.findByIdAndDelete(id);
        console.log(deltedlisting);
        req.flash("success"," Place is Deletedd!!");
        res.redirect("/listings");
     }));

     module.exports=router;