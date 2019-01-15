const {router} = require('./server');
const readStream = require('./readStream');
const postUrl = /^\/talks\/([^\/]+)\/comments$/;

// use readStream to get content of the request
// validate resulting data
// store data as a comment

router.add("POST", postUrl, async (server, title, request) => {
    let requestBody = await readStream(request);
    let comment;

    try {
        comment = JSON.parse(requestBody);
    } catch (_) {
        return {status: 400, body: "Invalid JSON"};
    }

    if (!comment ||
        typeof comment.author !== "string" ||
        typeof comment.message !== "string") {
        return {status: 400, body: "Bad comment data"};
    } 
    
    else if (title in server.talks) {
        server.talks[title].comments.push(comment);
        server.updated();
        return {status: 204};
    }

    else {
        return {status: 404, body: `No talk '${title}' found`};
    }

});

// trying to add a comment to a nonexistent talk returns a 404 error