const UserModel = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username , email ,password} = req.body;
    const newUser = new UserModel({email,username});
    const registeredUser = await UserModel.register(newUser,password);
    req.flash("success" , "welcome to wanderlust");
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success" , "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logIn = (req,res)=>{
    req.flash("success" ,"welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next) =>{
    req.logout(
        ((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success",  "You are Logged Out!");
            res.redirect("/listings");
        })
    )
  
};