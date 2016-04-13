# URL Shortener Microservice
A simple URL shortener built with Node.js, Express.js, and MongoDB

## User Stories:
1. A URL can be passed as a query in order to receive a shortened URL as a JSON response
2. If an invalid URL is passed, a JSON with an error will be received
3. The shortened URL will redirect to the original link

## Example:
Input:  https://terse-url.herokuapp.com/?url=www.google.com

Output:  {"original_url":"www.google.com","short_url":"https://terse-url.herokuapp.com/2"}

## Usage:
Short URL:  https://terse-url.herokuapp.com/2

Redirects to:  https://www.google.com/