let pup = require("puppeteer");
let storePID = require("./storePID.js");
let fs=require("fs");

let url = process.argv[2];
(async function yt(url) {
    try {
        await storePID(process.pid,"youtube");
    }
    catch (e) {
        process.exit();
    }
    let browser = await pup.launch({ headless: true, ignoreDefaultArgs: ["--mute-audio"] });
    let pages = await browser.pages();
    let page = pages[0];
    page.on("framenavigated",async()=>
    {
        let url=[];
        url.push({"url":page.url()});
        // console.log(`url is ${page.url()}`);  //comment out if want to write every visited link to youtubeOut.log
        fs.writeFile("./jsonFiles/resumePlaylist.json",JSON.stringify(url),(err)=>{
            if(err)
            {
                console.error(err);
            }
            setTimeout(()=>{
                page.screenshot({path:"./debugYoutube/snap.png"}); // visual of last visited page
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