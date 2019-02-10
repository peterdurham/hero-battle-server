const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuggestionSchema = new Schema({
  heroName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  upVotes: {
    type: [String]
  },
  downVotes: {
    type: [String]
  },
  date: {
    type: String,
    required: true
  }
});

module.exports = Suggestion = mongoose.model("suggestion", SuggestionSchema);
