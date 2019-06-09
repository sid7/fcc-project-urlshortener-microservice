const url = require("url").URL;
const dns = require("dns");
const Counter = require("./models/counter.js");
const ShortUrl = require("./models/short-url.js");

function sanitizeURL(url) {
  if(/\/$/.test(url)) {
    url = url.slice(0, -1);
  }
  return url;
}
function isValidURL(url, cb) {
  try {
    url = new URL(url);
  } catch(err) {
    return false;
  }
  dns.lookup(url.hostname, function(err) {
    cb(err ? false : true);
  });
}

exports.genShortUrl = function(req, res) {
  if(!req.body.url) {
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
      console.log({ err: err, at: "check-for-duplicate" });
      res.json({ error: err, at: "check-for-duplicate" });
      return;
    }
    if(sUrl) {
      res.json({ original_url: url, short_url: sUrl.slug });
    } else {
      console.log("gen new short-url");
      Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true }, function(err, doc) {
        const slug = doc.count;
        if(err || !slug) {
          console.log({ err: err, at: "failed-to-gen-slug", doc: doc });
          res.json({ error: err, at: "gen-slug" });
          return;
        }
        const newShortUrl = new ShortUrl({ url: url, slug: slug });
        newShortUrl.save(function(err) {
          if(err) {
            res.json({ error: err, at: "saving-new-short-url" });
          } else {
            res.json({ original_url: url, short_url: slug  });
          }
        })
      });
    }
  })
}

exports.redirectToOriginalUrl = function(req, res) {
  const slug = req.params.slug;
  if(!Number(slug)) {
    res.json({ error: "Wrong Format" });
    return;
  }
  ShortUrl.findOne({ slug: slug }, function(err, doc) {
    if(err) {
      res.json({ error: err, at: "finding URL in db" });
      return;
    }
    if(doc) {
      res.redirect(doc.url);
    } else {
      res.json({ error: "No URL Found" });
    }
  })
}