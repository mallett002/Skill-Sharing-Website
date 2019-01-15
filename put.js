const {router} = require('./server');
const talkPath = /^\/talks\/([^\/]+)$/;
const readStream = require('./readStream');

// Needs to read request bodies, check if has "presenter" & "summary" properties
router.add("PUT", talkPath, async (server, title, request) => {
    let requestBody = await readStream(request);    
    let talk;

    try {
        talk = JSON.parse(requestBody);
    } catch (_) {
        return {status: 404, body: "Invalid JSON"};
    }

    if (!talk ||
        typeof talk.presenter !== "string" ||
        typeof talk.summary !== "string") {
        return {status: 400, body: "Bad talk data"};
    }

    server.talks[title] = {
        title,
        presenter: talk.presenter,
        summary: talk.summary,
        comments: []
    };

    server.updated();
    return {status: 204};
});

// If data looks valid, PUT handler stores an obj that represents the new talk in the "talks" object