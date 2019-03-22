var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
  text: String,
  asked: String,
  answer: String
 },
{ timestamps: true}
)

module.exports = mongoose.model("question", questionSchema);