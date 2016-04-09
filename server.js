"use strict";

var express = require("express");
var mongo = require("mongodb").MongoClient;
var routes = require("./app/routes/index.js");

var app = express();

mongo.connect("mongodb://localhost:27017/urlparser", function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log("Successfully connected to MongoDB...")
    
    routes(app, db);
    
    app.listen(process.env.PORT || 8080, function() {
      console.log("Server listening on PORT 8080...");
    })
    
  }
})