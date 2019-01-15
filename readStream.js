// To retrieve content of req body--------------------------------------
// This function returns a promise that resolves a string
module.exports = (stream) => {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => resolve(data));
    });
};