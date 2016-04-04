"use strict";

module.exports = urlHandler;

function urlHandler(originalUrl, db, res) {
    
    var urls = db.collection("urls");
        
    var urlProjection = { _id: false };
        
    urls.find({
        "original_url": originalUrl
    }).toArray(function(err, result) {
        if (err) {
            throw err;
        }
        
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send("No matching document found");
        }
    });
    
}