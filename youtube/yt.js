let pup = require("puppeteer");
let storePID = require("./storePID.js");
let fs = require("fs");
let showNotification = require("./../sleepUtility/notifier");
let url = process.argv[2];
(async function yt(url) {
    try {
        await storePID(process.pid, "youtube");
    }
    catch (e) {
        process.exit();
    }
    let browser = await pup.launch({ headless: true, ignoreDefaultArgs: ["--mute-audio"] });
    let pages = await browser.pages();
    let page = pages[0];
    page.on("framenavigated", async () => {
        let url = [];
        url.push({ "url": page.url() });
        // console.log(`url is ${page.url()}`);  //comment out if want to write every visited link to youtubeOut.log
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
        console.error("provide URL please");
        process.exit();
    }
    await page.waitForTimeout(2000);
    try {
        await getThumnail(browser, page);
        let title=await page.evaluate(()=>{return document.querySelector("h1>.style-scope.ytd-video-primary-info-renderer").innerText});
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
        setInterval( async () => {
            let btnFound = document.querySelector(".ytp-ad-skip-button");
            if (btnFound) {
                btnFound.click();
            }
        }, 1000);
    })
})(url);

async function getThumnail(browser, page) {
    return new Promise(async (resolve, reject) => {
        let thumbnailLink = await page.evaluate(() => {
            let aTag = document.querySelector('[rel="image_src"]');
            let link = aTag.getAttribute("href");
            return link
        })
        let newpage = await browser.newPage();
        try {
            await newpage.goto(thumbnailLink);
        }
        catch (e) {
            reject(e);
        }
        await newpage.screenshot({ path: "./resources/thumbnail.png" });
        await newpage.close();
        resolve();

    })
}