const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const UserModel = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middlewares.js");
const userControllers = require("../controllers/users.js");

app.use(express.urlencoded({ extended: true }));

router.route("/signup")
.get(userControllers.signupForm)
.post(wrapAsync(userControllers.signUp))

router.route("/login")
.get(userControllers.loginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userControllers.logIn);


router.get("/logout", userControllers.logOut)

module.exports = router;

