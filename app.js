const express = require("express"),
app = express(),
bodyparser = require("body-parser"),
mongoose = require("mongoose"),
methodoverride = require("method-override"),
user = require("./models/user"),
passport = require("passport"),
LocalStrategy = require("passport-local");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");

// mongoose.connect("mongodb://localhost/WhyWonder");
mongoose.connect("mongodb://temp:mo7amed@ds121406.mlab.com:21406/whywonder")
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "IVSA",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRoutes);
app.use("/", questionRoutes);

var db = mongoose.connection;

app.get("/", function(req, res){
 if(req.user){
   res.redirect("/" + req.user.username);
 } else {
   res.render("home");
 }
})

app.get("/*", function(req, res){
  res.send("go away");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is Running");
});