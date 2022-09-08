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

try {
  // Connect to the MongoDB cluster
   mongoose.connect(
    "mongodb+srv://temp:tempoz@cluster0.b54n50h.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );

} catch (e) {
  console.log("could not connect");
}

// mongoose.connect("mongodb://0.0.0.0:27017/WhyWonder");
// mongoose.connect("mongodb+srv://temp:tempoz@cluster0.b54n50h.mongodb.net/")
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(bodyparser.urlencoded({ extended: true }));
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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRoutes);
app.use("/", questionRoutes);

app.get("/", function (req, res) {
  if (req.user) {
    res.redirect("/" + req.user.username);
  } else {
    res.render("home");
  }
})

app.get("/*", function (req, res) {
  res.send("Goooo away");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Running");
});
