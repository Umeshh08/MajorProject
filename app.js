if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listings.js');

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User  =  require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static('public'))



// app.get('/', (req, res) => {
//     res.send('i am root');
// });
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error" , (err)=>{
    console.log("ERROR IN MONGO SESSION" , err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));
app.use(flash());
// Authenticatins of the users
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser" , async(req,res)=>{
//     const demoUser = new User({
//         email : "Umesh@gmail",
//         username : "umesh8",
       
//     });
//    let fakeuser =  await User.register( demoUser, "Umesh123");
//    res.send(fakeuser);
// });



//index route
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/" , userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.render("listings/error.ejs", { message });
});


app.listen(8080, () => {
    console.log("App is listening");
});