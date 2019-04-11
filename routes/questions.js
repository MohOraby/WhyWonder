var express = require("express");
var router = express.Router();
var user = require("../models/user");
var question = require("../models/question");

// router.get("/:user", function(req, res){
//   user.findOne({username: req.params.user}, function(err, foundUser){
//     if(foundUser) {
//       question.find({asked: req.params.user}, function(err, questions){
//         res.render("user", {questions: questions, user: foundUser});
//       }).sort({ 'updatedAt' : -1 })
//     } else {
//       res.send("go away")
//     }
//   })
// });

router.get("/:user", async function(req, res){
  const foundUser = await user.findOne({username: req.params.user});
  const questions = await question.find({asked: req.params.user}).sort({ 'updatedAt' : -1 });
  if(!foundUser) {
    return res.send("go away again");
  } return res.render("user", {questions: questions, user: foundUser});
});


// router.get("/:user/questions", checkOwner, function(req, res){
//   user.findOne({username: req.params.user}, function(err, foundUser){
//     if(foundUser) {
//       question.find({asked: req.params.user}, function(err, questions){
//         res.render("questions", {questions: questions});
//       }).sort({ 'createdAt' : -1 })
//     } else {
//       res.send("go away")
//     }
//   })
// });

router.get("/:user/questions", checkOwner, async function(req, res){
  const foundUser = await user.findOne({username: req.params.user});
  const questions = await question.find({asked: req.params.user}).sort({ 'createdAt' : -1 });
  if(!foundUser) {
    return res.send("go away once more");
  } return res.render("questions", {questions: questions});
});

// router.get("/:user/:id", function(req, res){
//   question.findById(req.params.id, function(err, foundQuestion){
//     if(err){
//       console.log(err)
//     } else {
//       res.render("question", {question: foundQuestion})
//     }
//   });
// });

router.get("/:user/:id", async function(req, res){
  const foundUser = await user.findOne({username: req.params.user})
  const foundQuestion = await question.findById(req.params.id)
  if(!foundQuestion && !foundQuestion.asked === foundUser.username){
    return res.send("go awaaaaay");
  } return res.render("question", {question: foundQuestion});
});

router.post("/:user", function(req, res){
  var text = req.body.text;
  var asked = req.params.user;
  var asker = req.body.asker || undefined;
  var answer = undefined;
  var newQuest = {text: text, asked: asked, asker: asker, answer: answer};
  question.create(newQuest, function(err, newQuestion){
    if(err){
      console.log(err)
      res.redirect("/");
    } else {
      res.redirect("/" + req.params.user);
    }
  });
});

router.get("/:user/:id/answer", checkOwner, function(req, res){
  question.findById(req.params.id, function(err, foundQuestion){
    if(!foundQuestion.answer) {
      res.render("answer", {question: foundQuestion});
    } else {
      res.redirect("/")
    }
  });
});

router.put("/:user/:id", checkOwner, function(req, res){
  question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
    res.redirect("/");
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
    user.findOne({username: req.params.user}, function(err, foundUser){
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