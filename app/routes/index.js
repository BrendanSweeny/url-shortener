"use strict";

var urlHandler = require(process.cwd() + "/app/controllers/urlHandler.server.js");

module.exports = routes;

function routes(app, db) {
    
    app.get("/", function(req, res) {
        
        if (req.query.url) {
            //res.send(req.query.url);
            
            var originalUrl = req.query.url;
            
            //Remove tailing backslash to prevent unnecessary duplicate urls
            if (originalUrl[originalUrl.length - 1] === "/") {
                originalUrl = originalUrl.slice(0, originalUrl.length - 1);
            }
            
            urlHandler(originalUrl, db, res);
            
            
            //res.send(originalUrl);
            
            
            
        } else {
            res.send("Hello World");
        }
        
        
    })
    
}