const puppeteer = require('puppeteer');
const scheduleSleep = require("./jobSchedule.js");

async function sleepTime(hour,minute,period) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"], sloMo: 500 });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto('https://sleepyti.me/');
    await page.select("#hour", `${hour}`)
    await page.select("#minute", `${minute}`);
    await page.select("#ampm", `${period}`);
    await page.click("#calculate");
    await page.waitForTimeout(4000);
    await page.waitForSelector("#result4", { visible: true });
    for (let i = 1; i <= 4; i++) {
        let time = await page.evaluate(function (i) { return document.querySelector(`#result${i}`).innerText }, i);
        console.log(time);
        let hourIntwentyfourHourFormat = timeFormatChange(time.split(":")[0], time.split(" ")[1]);
        let minute = time.split(":")[1].split(" ")[0];
        scheduleSleep(minute, hourIntwentyfourHourFormat);
    }

}
function timeFormatChange(hour, period) {
    if (period === "AM" && hour == 12) return Number(hours) - 12;
    if (period === "PM" && hour < 12) return Number(hour) + 12;

    return hour;
}
module.exports = sleepTime;