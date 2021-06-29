const pup = require("puppeteer");
const storePID = require("../storePID.js");
const fs = require("fs");
const showNotification = require("./../sleepUtility/notifier");
const startWatching = require("./watcher.js");
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
    let browser = await pup.launch({ headless: true, ignoreDefaultArgs: ["--mute-audio"] });
    let pages = await browser.pages();
    let page = pages[0];
    page.on("framenavigated", async () => {
        let url = [];
        url.push({ "url": page.url() });
        // console.log(`Current Url is ${page.url()}`);  //comment out if want to write every visited link to youtubeOut.log
        fs.writeFile("./jsonFiles/resumePlaylist.json", JSON.stringify(url), (err) => {
            if (err) {
                console.error(err);
            }
            setTimeout(() => {
                page.screenshot({ path: "./debugYoutube/snap.png" }); // visual of last visited page
            }, 2000);
        });
    });
    try {
        await page.goto(url);
    }
    catch (e) {
        console.error("Invalid URL/Internet is Slow");
        process.exit();
    }
    const watcher = chokidar.watch("./jsonFiles/controls.json", { persistent: true, awaitWriteFinish: true });
    startWatching(page, watcher);
    browser.on('disconnected', () =>   // close watcher when browser close , so node server can stop watching and let process exit 
    {
        watcher.close();
    })
    await page.waitForTimeout(2000);
    try {
        await getThumbnail(browser, page);
        let title = await page.evaluate(() => { return document.querySelector("h1>.style-scope.ytd-video-primary-info-renderer").innerText });
        let notificationProperties = {
            title: "Youtube Now Playing",
            message: title,
            sound: false,
            icon: ".//resources//thumbnail.png"
        }
        await showNotification(notificationProperties);
    }
    catch (e) {
        console.error(`No thumbail link found for ${url} error is ${e}`);
    }
    await page.waitForSelector("#movie_player", { visible: true });
    await page.click("#movie_player");
    await page.evaluate(async () => {
        setInterval(async () => {
            let btnFound = document.querySelector(".ytp-ad-skip-button");
            if (btnFound) {
                btnFound.click();
            }
        }, 1000);
    })
})(process.argv[2]);




