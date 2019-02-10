const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  hero1: {
    type: String,
    required: true
  },
  hero1votes: {
    type: [String],
    required: true
  },
  hero2: {
    type: String,
    required: true
  },
  hero2votes: {
    type: [String],
    required: true
  },
  winner: {
    type: String,
    required: true
  }
});

module.exports = Result = mongoose.model("result", ResultSchema);
