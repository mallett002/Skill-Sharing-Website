// Component to help dispatch a request to the function that can handle it.
// Ex: PUT requests with a path that matches /^\/talks\/([^\/]+)$/ 
// "/talks/talk-title"
// Can be handled by a given function.

// Write our own router, although many on NPM
const {parse} = require('url');

module.exports = class Router {
    constructor() {
        this.routes = [];
    }

    // register new handlers with "add method"
    add(method, url, handler) {
        this.routes.push({method, url, handler});
    }

    // resolve requests with "resolve method"
    // returns resp when handler is found (by calling the handler), or null
    // tries routes one at a time
    // Context will be server instance.
    resolve(context, request) {
        let path = parse(request.url).pathname;

        for(let {method, url, handler} of this.routes) {
            let urlMatch = url.exec(path);
            if (!urlMatch || request.method !== method) continue; // if no match, or req.method isn't same as this method, go to next item
            let urlParts = urlMatch.slice(1).map(decodeURIComponent); // array of decoded urls
            return handler(context, ...urlParts, request); // call handler, which returns a response
        }
        return null;
    }
};


