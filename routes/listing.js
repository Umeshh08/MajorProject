const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listings.js');
const {listingSchema ,reviewSchema  } = require("../schema.js");
const {isLoggedIn} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

router.route("/")
.get( wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))


//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,listingController.deleteListing)

//edit listing route
router.get("/:id/edit", isLoggedIn , wrapAsync(listingController.renderEditForm));

//updatelisting

module.exports = router;