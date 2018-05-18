var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo");
var app = express();

app.set("view engine","ejs");
app.use (bodyParser.urlencoded({extended: true}));
//initializing express session
app.use(require("express-session")({
    secret: "Node JS is Best!",
    resave: false,
    saveUninitialized: false
}));

//to read the sessions and encode + decode the data
//encoding
passport.serializeUser(User.serializeUser());
//decoding
passport.deserializeUser(User.deserializeUser());

//initializing passport
app.use(passport.initialize());
app.use(passport.session());

//************************* */
// ROUTES
//************************* */

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/loggedin", (req, res) => {
    res.render("loggedin");
});

//Auth Routes
//show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//Post up form
app.post("/register", function(req, res){
     req.body.username
     req.body.password
     User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/loggedin");
            })
        }
     });
});

//listening port
app.listen("3002", function () {
    console.log("Server started at localhost:3002");
});