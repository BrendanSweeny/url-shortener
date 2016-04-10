"use strict";

var validator = require("validator");

module.exports = DocHandler;

//Constructor function that handles url document lookup and creation
function DocHandler(db) {
    
    var urls = db.collection("urls");
    var urlProjection = { _id: false, path: false };
    
    //Private helper function that creates or iterates currentId property of urlIdGenerator document
    //and creates new document corresponding to url passed to this.lookUpDoc
    //The path used in the shortened urls is simply an integer that is incremented
    //each time a url document is created
    function generateDoc(originalUrl, callback) {
        
        var host = "https://terse-url.herokuapp.com/";
        var path;
        
        //Finds and increments the currentId property of urlIdGenerator document
        urls.findAndModify(
            //Query:
            { "urlIdGenerator": true },
            //Sort:
            { _id: 1 },
            //Update:
            { $inc: { "currentId": 1 }},
            //Options: returns newest version or inserts new doc if none matched (upsert: true)
            { new: true, upsert: true },
            //Callback:
            function(err, result) {
                if (err) {throw err;}
                //The highest current path number
                var currentId = result.value.currentId;
                path = currentId.toString();
                
                //Creates new doc corresponding to url passed to this.lookUpDoc
                urls.insert({
                    "original_url": originalUrl,
                    "short_url": host + path,
                    "path": path
                });

                //After new url document is created, it is found and sent to response
                urls.findOne({"original_url": originalUrl}, urlProjection, function(err, result) {
                    if (err) {throw err;}
                    
                    var doc = result;
                    return callback(doc);
                });

            });
    }
    
    //Searches db by url. If found, sends JSON
    //if not found, calls generateDoc()
    this.lookUpDoc = function(req, res) {
        
        var originalUrl = req.query.url;
        
        //If invalid URL is passed: json with error is passed to callback
        if (!validator.isURL(originalUrl)) {
            res.json({"error": "Invalid URL Format"});
            return;
        }
        
        //Remove tailing backslash to prevent unnecessary duplicate urls
        if (originalUrl[originalUrl.length - 1] === "/") {
            originalUrl = originalUrl.slice(0, originalUrl.length - 1);
        }
        
        //Mongo document search by original url
        urls.findOne({
            "original_url": originalUrl
        }, urlProjection, function(err, result) {
            if (err) {throw err;}
            
            //If a doc is matched it is passed to the callback
            if (result) {
                res.json(result);
                return;
            
            //If there is no result document, generateDoc() is called
            //and the created document is passed to the callback
            } else {
                generateDoc(originalUrl, function(doc) {
                    res.json(doc);
                    return;
                });
                
            }
        });   
    };
    
    //Private function that validates path as an integer
    //Prevents invalid paths, such as: urls, "favicon.ico" and "123.456"
    function validPath(path) {
        if (Number(path) && path.indexOf(".") === -1) {
            return true;
        } else {
            return false;
        }
    }
    
    //Searches db by path number and passes original url of 
    //matched doc to callback
    this.redirectUrl = function(path, res) {
        
        //Path validation
        if (validPath(path)) {
            
            //findOne is used because findOne() returns the document
            //whereas find() returns a cursor and crashes server
            //when no matching document is found for input path
            urls.findOne({"path": path}, {_id: false, path: false, short_url: false}, function(err, doc) {
                if (err) {throw err;}
                
                //If doc is matched, protocol is added if necessary and browser
                //is redirected
                if (doc) {
                    if (doc.original_url.indexOf("http") === -1) {
                        res.redirect("http://" + doc.original_url);
                        return;
                    } else {
                        res.redirect(doc.original_url);
                        return;
                    }
                
                //If no doc is matched (e.g. path integer is too high),
                //"Invalid path" is sent
                } else {
                    res.json({"error": "Invalid path"});
                    return;
                }
            });
        
        //"Invalid path" is sent if path is not validated
        } else {
            res.json({"error": "Invalid path"});
            return;
        }
        
    };
    
}