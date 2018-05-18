var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
//initializing express session
app.use(require("express-session")({
    secret: "Node JS is Best!",
    resave: false,
    saveUninitialized: false
}));

//to read the sessions and encode + decode the data
passport.use(new LocalStrategy(User.authenticate()));
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

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/loggedin", isLoggedIn, (req, res) => {
    res.render("loggedin");
});

//Auth Routes
//show sign up form
app.get("/register", function (req, res) {
    res.render("register");
});
//handling sign up form
app.post("/register", function (req, res) {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/loggedin");
            })
        }
    });
});

//show Log in form
app.get("/login", function (req, res) {
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
    //middleware: run between two routes loggedin and login
    successRedirect: "/loggedin",
    failureRedirect: "/login"
}), function (req, res) {
    if (err) {
        console.log(err);
    }
});

//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
//problem solved: "/loggedin" route can access only if you are loggedin
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//listening port
app.listen("3002", function () {
    console.log("Server started at localhost:3002");
});