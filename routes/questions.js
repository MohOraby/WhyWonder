var express = require("express");
var router = express.Router();
var user = require("../models/user");
var question = require("../models/question");

router.get("/:user", function(req, res){
  user.findOne({username: req.params.user.toString()}, function(err, foundUser){
    if(foundUser) {
      question.find({asked: req.params.user.toString()}, function(err, questions){
        res.render("user", {questions: questions, user: user, username: req.params.user.toString()});
      })
    } else {
      res.send("go away")
    }
  })
});

router.get("/:user/ask", function(req, res){
  user.findOne({username: req.params.user.toString()}, function(err, user){
    if(err) {
      console.log(err);
    } else {
      res.render("ask", {user: user});
    }
  })
});

router.get("/:user/questions", checkOwner, function(req, res){
  user.findOne({username: req.params.user.toString()}, function(err, foundUser){
    if(foundUser) {
      question.find({asked: req.params.user.toString()}, function(err, questions){
        res.render("questions", {questions: questions, user: req.params.user.toString()});
      })
    } else {
      res.send("go away")
    }
  })
});

router.get("/:user/:id", function(req, res){
  var user = req.params.user.toString();
  question.findById(req.params.id, function(err, foundQuestion){
    if(err){
      console.log(err)
    } else {
      res.render("question", {question: foundQuestion, user: user})
    }
  })
})

router.post("/:user", function(req, res){
  question.create(req.body.question, function(err, newQuestion){
    if(err){
      console.log(err)
      res.redirect("/");
    } else {
      res.redirect("/" + req.params.user);
    }
  })
});

router.get("/:user/:id/answer", checkOwner, function(req, res){
  question.findById(req.params.id, function(err, foundQuestion){
    if(foundQuestion.answer === undefined) {
      res.render("answer", {question: foundQuestion});
    } else {
      res.redirect("/")
    }
  });
});

router.put("/:user/:id", checkOwner, function(req, res){
  question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/hello");
    }
  });
});

router.delete("/:user/:id", checkOwner, function(req, res){
  question.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      res.redirect("/" + req.user.username);
    } else {
      res.redirect("back");
    }
  });
});

function checkOwner(req, res, next) {
  if(req.isAuthenticated()) {
    user.findOne({username: req.params.user.toString()}, function(err, foundUser){
      if(req.user.username === foundUser.username) {
        next();
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/")
  }
}

module.exports = router;