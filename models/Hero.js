const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  alias: {
    type: String
  },
  occupation: {
    type: String
  },
  weapon: {
    type: String
  },
  creator: {
    type: String
  }
});

module.exports = Hero = mongoose.model("hero", HeroSchema);
