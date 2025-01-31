const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const Review = require("../../Data/review.js");
const Listing = require("../../Data/listing.js"); 
const flash=require("connect-flash");
const session=require("express-session");
router.post("/",(async(req,res)=>{
    let listing= await  Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    
    listing.reviews.push(newReview);
   
    await newReview.save();
    await listing.save();
    req.flash("success","New Review is Addedd!!");
       res.redirect(`/listings/${listing._id}`)
   })); 
   // delete  Review route
   router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
    // res.redirect(`/listings/${listing._id}`)
    req.flash("success","review is Deleteed!!");
       res.redirect(`/listings/${id}`);
   }));

   module.exports=router;