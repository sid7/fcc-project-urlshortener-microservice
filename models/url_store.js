const mongoose = require("mongoose");

const ShortUrl = new mongoose.Scheme({
  url: {
    type: String,
    required: true
  },
  slug: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("ShortUrl", ShortUrl);