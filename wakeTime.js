const puppeteer=require("puppeteer");
let wakeupTimings=[];
(async function wakeTime()
{
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"], sloMo: 500 });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto('https://sleepyti.me/');
    await page.click("#zzz");
    await page.waitForTimeout(4000);
    await page.waitForSelector("#resultNow6", { visible: true });
    for (let i = 1; i <= 6; i++) {
        let time = await page.evaluate(function (i) { return document.querySelector(`#resultNow${i}`).innerText }, i);
       wakeupTimings.push(time);
    }
    await page.close();
})();

//module.exports= wakeTime;