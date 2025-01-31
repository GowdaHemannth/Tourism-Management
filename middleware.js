module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","login before you do Add");
      return res.redirect("/login");
     }
     next();
}