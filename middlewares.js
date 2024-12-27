const Review = require('./models/reviews.js');




module.exports.isLoggedIn= (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You have to login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};





// module.exports.isreviewAuthor = async (req,res,next) => {
//     let{id,reviewID} = req.params;
//     let review = await Review.findById(reviewID);

//     if(!review.author.equals(res.locals.currUser._id)){
//         req.flash("error" , "You are not the of this review");
//         return res.redirect(`/listings/${id}`);
//     }
//  next();
// }
