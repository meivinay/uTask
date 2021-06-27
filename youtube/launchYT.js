const { spawn } = require("child_process");
const fs = require("fs");
const err = fs.openSync("./youtube.log", "a");
const out = fs.openSync("./youtube.log", "a");
async function launch(url) {
    new Promise((resolve, reject) => {
        try {
            let youtube = spawn(process.argv[0], [`youtube/yt.js`, url], {  //launch youtube as a detached process and its ouput is linked to youtube.log
                detached: true,
                stdio: ["ignore", out, err]
            });
            youtube.unref();
            resolve();
        }
        catch (e) {
            console.log(e);
            reject();
        }
    });
}

module.exports = launch;