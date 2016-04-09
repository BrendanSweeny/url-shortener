"use strict";

var DocHandler = require(process.cwd() + "/app/controllers/DocHandler.server.js");
var validator = require("validator");

module.exports = routes;

function routes(app, db) {
    
    var docHandler = new DocHandler(db);
    
    app.get("/", function(req, res) {
        
        //The URL must be passed as a url query
        if (req.query.url) {
            
            var originalUrl = req.query.url;
            
            //Calls docHandler lookUpDoc function and sends json
            docHandler.lookUpDoc(originalUrl, function(result) {
                res.json(result);
            });
            
        //If no url query is passed to host, homepage is sent
        } else {
            res.send("Hello World");
        }
        
    });
    
    app.get("/:path", function(req, res) {
        
        //The short url path is a string of whole numbers
        var path = req.params.path;
        
        docHandler.redirectUrl(path, function(result) {
            
            //If the resulting URL is not valid, error is sent
            if (!validator.isURL(result)) {
                res.send(result);
            } else if (result.indexOf("http") === -1) {
                res.redirect("http://" + result);
            } else {
                res.redirect(result);
            }
            
        });
        
    });
    
}