// If a request matches none of the request types defined in our router...
// ...the server must interpret it as a request for file in the public dir.

// ecstatic called with config obj to produce a handler function
// handler func passed to createServer to create a server that only serves files
const {createServer} = require('http');
const Router = require('./router');
const ecstatic = require('ecstatic');
const router = new Router();
const defaultHeaders = {"Content-Type": "text/plain"};

class SkillShareServer {
    constructor(talks) {
        this.talks = talks; // obj for HTTP resources
        this.version = 0;
        this.waiting = [];

        let fileServer = ecstatic({root: "./public"});

        this.server = createServer((request, response) => {
            let resolved = router.resolve(this, request);   // returns response promise or null from router

            if (resolved) {
                // req matched a request type defined in router
                resolved.catch(error => {
                    // handle any errors
                    if (error.status !== null) return error;
                    return {body: String(error), status: 500};
                }).then(({body, status = 200, headers = defaultHeaders}) => {
                    // Server responds with a header and body
                    response.writeHead(status, headers);
                    response.end(body);
                });
            } else {
                // else, a req for file in public dir
                fileServer(request, response);
            }
        });
    }

    start(port) {
        this.server.listen(port);
    }

    stop() {
        this.server.close();
    }
}

// Handlers return promises that resolve into objs describing the response.
// It wraps the server in an obj that also holds its state

// Server will serve files from the public subdirectory alongside a talk-managing interface under the "/talks" URL.
new SkillShareServer(Object.create(null)).start(8000);

module.exports = {
    router,
    SkillShareServer
};
