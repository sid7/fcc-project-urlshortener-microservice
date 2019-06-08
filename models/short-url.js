const mongoose = require("mongoose");

const ShortUrl = new mongoose.Schema({
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