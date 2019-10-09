const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  //   user: {},
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "public"
  },
  allowComments: {
    type: Boolean,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("posts", postSchema);
