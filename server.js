'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();
var bodyParser = require("body-parser");

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useFindAndModify: false }, function(err) {
  console.log(err || "db connected");
});
var myApp = require("./app.js");

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", myApp.genShortUrl);
app.get("/api/shorturl/:slug", myApp.redirectToOriginalUrl);

app.listen(port, function () {
  console.log('Node.js listening ...');
});