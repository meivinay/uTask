 let pup = require("puppeteer");
let storePID = require("./storePID.js")
let url = process.argv[2];
(async function yt(url) {
    try {
        await storePID(process.pid, "youtube");
    }
    catch (e) {
        console.log(e);
        process.exit();
    }
    let browser = await pup.launch({ headless: true, ignoreDefaultArgs: ["--mute-audio"] });
    console.log("opened Chromium");
    let pages = await browser.pages();
    let page = pages[0];
    try {
        console.log(url);
        await page.goto(url);
    }
    catch (e) {
        console.log("provide URL please");
        process.exit();
    }
    await page.waitForTimeout(5000);
    await page.waitForSelector("#movie_player",{visible:true});
    await page.click("#movie_player");
    await page.evaluate(() => {
        setInterval(async () => {

            let btnFound = document.querySelector(".ytp-ad-skip-button");
            if (btnFound) {
                console.log("btn found");
                btnFound.click();
            }
            else {
                console.log("button not found checking again");
            }
        }
            , 1000);
    })
})(url);