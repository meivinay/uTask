const { spawn } = require("child_process");
const fs = require("fs");
async function launch(url) {
    const err = fs.openSync("./log/youtubeErr.log", "a");
    const out = fs.openSync("./log/youtubeOut.log", "a");
    new Promise((resolve, reject) => {
        try {
            let youtube = spawn(process.argv[0], [`youtube/youtube.js`, url], {  //launch youtube as a detached process and its ouput is linked to youtubeOut.log and youtubeErr.log
                detached: true,
                stdio: ["ignore", out, err]
            });
            youtube.unref();
            resolve();
        }
        catch (e) {
            console.out(e);
            reject();
        }
    });
}

module.exports = launch;