const { model } = require("mongoose");
const Review = require("../models/reviews");
const Listing = require("../models/listings");

module.exports.postReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing.id}`);

};

module.exports.destroyReview = async(req,res)=>{
    let {id ,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
};

