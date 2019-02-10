const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BattleSchema = new Schema({
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
    type: String
  }
});

module.exports = Battle = mongoose.model("battle", BattleSchema);
