const fs = require("fs");

async function watcher(page, watcher) {
    watcher.on("change", async (path) => {
        // console.log("executing command on youtube..");
        try {
            let data = await readFile();
            let arr = [];
            let obj = JSON.parse(data)[0];
            for (k in obj) {                          //initially all key are false
                if (obj[k] === true) {
                    if (k == "S") {                           //start stop
                        await page.keyboard.press("KeyK");
                    }
                    else if (k === "N") {                   //next video
                        await page.keyboard.down('Shift');
                        await page.keyboard.press('KeyN');
                        await page.keyboard.up('Shift');
                    }
                    else if (k === "P") {                   //previous video
                        await page.keyboard.down('Shift');
                        await page.keyboard.press('KeyP');
                        await page.keyboard.up('Shift');
                    }
                    else if (k === "M") {                       // mute unmute
                        await page.keyboard.press("KeyM");
                    }
                    else if (k === "B") {                       // seek 10 seconds backward
                        await page.keyboard.press("KeyJ");
                    }
                    else if (k === "F") {                       // seek 10 seconds forward
                        await page.keyboard.press("KeyL");
                    }
                    else if (k === "U") {                       // speed up video
                        await page.keyboard.down('Shift');
                        await page.keyboard.press('.');
                        await page.keyboard.up('Shift');
                    }
                    else if (k === "D") {                       //slow down video
                        await page.keyboard.down('Shift');
                        await page.keyboard.press(",");
                        await page.keyboard.up('Shift');
                    }
                    else if (k === "H") {                       // begining of video
                        await page.keyboard.press("Home");

                    }  
                    else if (k === "E") {                     // end of the video
                        await page.keyboard.press("End");
                    }
                    obj[k] = false;
                    arr.push(obj);
                    try {
                        await writeFile(arr);
                        break;
                    }
                    catch (e) {
                        console.error("can not write json in watcher error is ===>>>" + e)
                    }
                }
            }
        }
        catch (e) {
            console.error("can not read file in wathcer Error is ===>>>" + e);
        }
    })
}
async function readFile() {
    return new Promise((resolve, reject) => {
        fs.readFile("./jsonFiles/controls.json", "utf8", async (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
}

async function writeFile(arr) {
    return new Promise((resolve, reject) => {
        fs.writeFile("./jsonFiles/controls.json", JSON.stringify(arr), async (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}

module.exports = watcher;