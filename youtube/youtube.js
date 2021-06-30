const pup = require("puppeteer");
const storePID = require("../detachedProcessHandlers/storePID.js");
const fs = require("fs");
const showNotification = require("../sleepUtility/showNotification");
const startWatching = require("./performShortcutsAction");
const chokidar = require("chokidar");
const getThumbnail = require("./getThumbnail.js");

(async function yt(url) {
    try {
        await storePID(process.pid, "youtube");
    }
    catch (e) {
        console.error("Could Not store Process ID");
        process.exit();
    }
    let browser = await pup.launch({ headless: true, ignoreDefaultArgs: ["--mute-audio"],args:["--start-maximized"],defaultViewport:null });
    let pages = await browser.pages();
    let youtube = pages[0];
    youtube.on("framenavigated", async () => {
        let url = [];
        url.push({ "url": youtube.url() });
        // console.log(`Current Url is ${page.url()}`);  //comment out if want to write every visited link to youtubeOut.log
        fs.writeFile("./jsonFiles/resumePlaylist.json", JSON.stringify(url), (err) => {
            if (err) {
                console.error(err);
            }
        });
        setTimeout(() => {
            youtube.screenshot({ path: "./debug/youtube.png" }); // visual of last visited page for debug purpose
        }, 2000);

    });
    try {
        await youtube.goto(url);
    }
    catch (e) {
        console.error("Invalid URL/Internet is Slow");
        process.exit();
    }
    const watcher = chokidar.watch("./jsonFiles/controls.json", { persistent: true, awaitWriteFinish: true });
    startWatching(youtube, watcher);
    browser.on('disconnected', () =>   // close watcher when browser close , so node server can stop watching and let process exit 
    {
        watcher.close();
    })
    await youtube.waitForTimeout(2000);
    try {
        await getThumbnail(browser, youtube);
        let title = await youtube.evaluate(() => { return document.querySelector("h1>.style-scope.ytd-video-primary-info-renderer").innerText });
        let notificationProperties = {
            title: "Youtube Now Playing",
            message: title,
            sound: false,
            icon: ".//resources//youtubeThumbnail.png"
        }
        await showNotification(notificationProperties);
    }
    catch (e) {
        console.error(`No thumbail link found for ${url} error is ${e}`);
    }
    await youtube.waitForSelector("#movie_player", { visible: true });
    await youtube.click("#movie_player");
    await youtube.evaluate(async () => {
        setInterval(async () => {
            let btnFound = document.querySelector(".ytp-ad-skip-button");
            if (btnFound) {
                btnFound.click();
            }
        }, 1000);
    })
})(process.argv[2]);




