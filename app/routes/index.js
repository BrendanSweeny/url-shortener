"use strict";

var DocHandler = require(process.cwd() + "/app/controllers/DocHandler.server.js");

module.exports = routes;

function routes(app, db) {
    
    var docHandler = new DocHandler(db);
    
    //Listener for homepage and short url generator
    app.get("/", function(req, res) {
        
        //The URL must be passed as a url query
        if (req.query.url) {
            
            docHandler.lookUpDoc(req, res);
            
        //If no url query is passed to host, homepage is sent
        } else {
            res.send("Hello World");
        }
        
    });
    
    //Listener for short url to original url redirect
    app.get("/:path", function(req, res) {
        
        //The short url path is a string of whole numbers
        var path = req.params.path;
        
        docHandler.redirectUrl(path, res);
        
    });
    
}