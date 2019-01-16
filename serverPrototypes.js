// For Long Polling support

// Are multiple place we'll need to send array of talks
// Helper method that builds up array & includes ETag in response
const {SkillShareServer} = require('./server');

SkillShareServer.prototype.talkResponse = function() {
    let talks = []; // array of talk objects

    for (let title of Object.keys(this.talks)) { // make array of titles
        talks.push(this.talks[title]); // put array of talk objs in talks
    }

    return {
        body: JSON.stringify(talks),
        headers: {
            "Content-Type": "application/json",
            "ETag": `"${this.version}"`
        }
    };
};

// Callbacks for delayed requests stored in server's "waiting" array
// "waitForChanges" set's a timer to respond with a 304 when waited long enough
SkillShareServer.prototype.waitForChanges = function(time) {
    return new Promise(resolve => {
        this.waiting.push(resolve);

        setTimeout(() => {
            if (!this.waiting.includes(resolve)) return;    // If resolve isn't in there, return
            this.waiting = this.waiting.filter(callback => callback !== resolve);   // Keep items that aren't "resolve"
            resolve({status: 304});     // resolve with 304
        }, time * 1000);
    });
};

// Register a change with "updated" increases the server's version number and wakes up all waiting requests
SkillShareServer.prototype.updated = function() {
    this.version++;
    let response = this.talkResponse;   // defined as a prototype of class
    this.waiting.forEach(resolve => resolve(response));
    this.waiting = [];
};