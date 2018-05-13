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

app.get("/", function(req, res){
    res.render("home");
});

app.get("/loggedin", (req, res) => {
    res.render("loggedin");
});

//listening port
app.listen("3002", function () {
    console.log("Server started at localhost:3002");
});