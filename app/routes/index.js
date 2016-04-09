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
            
            //Validates URL
            if (validator.isURL(originalUrl)) {
                
                //Remove tailing backslash to prevent unnecessary duplicate urls
                if (originalUrl[originalUrl.length - 1] === "/") {
                    originalUrl = originalUrl.slice(0, originalUrl.length - 1);
                }
            
                //Calls docHandler lookUpDoc function and sends json
                docHandler.lookUpDoc(originalUrl, function(result) {
                    res.json(result);
                });
            
            //If invalid URL is passed: json with error is sent
            } else {
                res.json({
                    "error": "Invalid URL Format"
                });
            }
            
            
        //If no url query is passed to host, homepage is sent
        } else {
            res.send("Hello World");
        }
        
        
    });
    
    app.get("/:path", function(req, res) {
        
        var path = req.params.path;
        
        docHandler.redirectUrl(path, res, function(result) {
            //var originalUrl = result[0].original_url;
            
            if (!validator.isURL(result)) {
                res.send(result);
            } else if (result.indexOf("http") === -1) {
                res.redirect("http://" + result);
            } else {
                res.redirect(result);
            }
            
            //res.send(result);
        });
        
        //res.send("Received ID: " + req.params.id);
    });
    
}