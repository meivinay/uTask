let pup = require("puppeteer");
let storePID = require("./storePID.js");
let fs=require("fs");

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
    page.on("framenavigated",async()=>
    {
        let url=[];
        url.push({"url":page.url()});
        console.log(1);
        console.log(`url is ${page.url()}`);
        fs.writeFile("./jsonFiles/resumePlaylist.json",JSON.stringify(url),(err)=>{
            if(err)
            {
                console.log(err);
            }
        });
       
    });
    try {
        await page.goto(url);
    }
    catch (e) {
        console.log("provide URL please");
        process.exit();
    }
    await page.waitForTimeout(5000);
    await page.waitForSelector("#movie_player", { visible: true });
    await page.click("#movie_player");
    await page.evaluate(() => {
        setInterval(async () => {

            let btnFound = document.querySelector(".ytp-ad-skip-button");
            if (btnFound) {
                btnFound.click();
            }
        }, 1000);
    })
})(url);