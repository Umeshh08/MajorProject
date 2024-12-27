const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = session({
    secret: "mysupersecretstring", // Replace with a strong, secure secret string
    resave: false,                // Do not save session if it wasn't modified
    saveUninitialized: true,      // Save uninitialized sessions
});
app.use(sessionOptions);
app.get("/register" ,(req,res)=>{
    let{name = "Anonymouse"} = req.query;
    console.log(req.session);
    res.send(name);
})



app.get("/", (req, res) => {
    res.send("Hello, session is set up!");
});

app.listen(3000, () => {
    console.log("App is listening on port 3000...");
});
