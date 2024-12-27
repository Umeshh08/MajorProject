const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listings.js');
const Review = require('../models/reviews.js');
const {reviewSchema  } = require("../schema.js");
const {isLoggedIn , isreviewAuthor} = require("../middlewares.js")
const controllerReview = require("../controllers/reviews.js");

//reviews post
const validateReviews = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
router.post("/", isLoggedIn,validateReviews,wrapAsync(controllerReview.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,wrapAsync(controllerReview.destroyReview)); 

module.exports = router;