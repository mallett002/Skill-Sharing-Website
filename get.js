// GET handler----------------------------------------------------------
// Each talk accessed at "/talks/[title]"
// look up talk and respond with talk's JSON or 404
const {router} = require('./server');
const talkPath = /^\/talks\/([^\/]+)$/;

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