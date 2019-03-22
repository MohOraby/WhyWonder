var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", isLoggedOut, function(req, res){
  user.register(new user({username: req.body.username}), req.body.password, function(err, user){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    });
  });
});

router.get("/login", isLoggedOut, function(req, res){
  res.render("login");
});

router.post("/login", isLoggedOut, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}) ,function(req,res){
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedOut(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;