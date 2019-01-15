// Removes it from the "talks" object
const {router} = require('./server');
const talkPath = /^\/talks\/([^\/]+)$/;

router.add("DELETE", talkPath, async (server, title) => {
    if (title in server.talks) {
        delete server.talks[title];
        server.updated(); // notifies waiting long polling requests about the deletion
    }
    return {status: 204};
});