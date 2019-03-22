var mongoose = require("mongoose");
var user = require("./user");

var questionSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: String
  },
  text: String,
  asked: String,
  answer: String
})

module.exports = mongoose.model("question", questionSchema);