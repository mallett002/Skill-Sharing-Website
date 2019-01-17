// For requests the GET a single talk

// Each talk accessed at "/talks/[title]"
// look up talk and respond with talk's JSON or 404
const {router} = require('./server');
const talkPath = /^\/talks\/([^\/]+)$/;

// GET for retrieving JSON about a specific talk
router.add("GET", talkPath, async (server, title) => {
    // if server.talks has [title]
    if (title in server.talks) {
        // respond with the talk's JSON
        return {
            body: JSON.stringify(server.talks[title]),
            headers: {"Content-Type": "application/json"}
        };

    } else {
        // Not found, respond with a 404
        return {status: 404, body: `No talk "${title}" found`};
    }
});

// GET Requests for Long Polling 
router.add("GET", /^\/talks$/, async (server, request) => {
    let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
    let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);

    if (!tag || tag[1] !== server.version) {
        return server.talkResponse();  
    } else if (!wait) {
        return {status: 304}; // 304 Not Modified
    } else {
        return server.waitForChanges(Number(wait[1]));
    }
});