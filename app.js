const url = require("url").URL;
const Counter = require("./models/counter.js");
const ShortUrl = require("./models/short-url.js");

function sanitizeURL(url) {
  if(/\/$/.test(url)) {
    url = url.slice(0, -1);
  }
  return url;
}
function isValidURL(url) {
  try {
    url = new URL(url);
  } catch(err) {
    return false;
  }
  return true;
}

exports.genShortUrl = function(req, res) {
  if(!req.body.slug) {
    res.json({ error: "No URL Found" });
    return;
  }
  
  const url = sanitizeURL(req.body.url);
  
  if(!isValidURL(url)) {
    res.json({ error: "Invalid URL" });
    return;
  }
  
  ShortUrl.findOne({ url: url }, function(err, sUrl) {
    if(err) {
      console.log(err);
      res.json({ error: err, at: "check for existing short-url for given url" });
      return;
    }
    if(!s)
  })
}

exports.redirectToOriginalUrl = function(req, res) {
  
}