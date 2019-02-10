const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  avatar: {
    type: String,
    required: true
  },
  votes: {
    type: [String]
  },
  brackets: {
    type: [String]
  },
  // links: {
  //   website: {
  //     type: String
  //   },
  //   twitter: {
  //     type: String
  //   },
  //   youtube: {
  //     type: String
  //   },
  //   github: {
  //     type: String
  //   }
  // },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
