const puppeteer = require('puppeteer');
const fs = require("fs");
//const scheduleSleep = require("./scheduleSleepNotification.js");
const { spawn } = require("child_process");
let sub_process = [];
const out = fs.openSync("./schedule.log","a");
const err = fs.openSync("./schedule.log","a");


async function sleepTime(hour, minute, period) {
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
        let time = await page.evaluate((i)=> { return document.querySelector(`#result${i}`).innerText }, i);
        let hourIntwentyfourHourFormat = timeFormatChange(time.split(":")[0], time.split(" ")[1]);
        let minute = time.split(":")[1].split(" ")[0];
        await createJobs(minute, hourIntwentyfourHourFormat,i);
    }
    await page.close();
}
function timeFormatChange(hour, period) {
    if (period === "AM" && hour == 12)
        return Number(hour) - 12;

    if (period === "PM" && hour < 12)
        return Number(hour) + 12;

    return hour;
}

async function createJobs(minute, hour,i) {
    new Promise((resolve, reject)=> {
        try {
            sub_process.push(spawn(process.argv[0], [`scheduleSleepNotification.js`, minute, hour], {  //create scheduled notification using schedulesleepnotification.jsfor sleep and detach from main process
                detached: true,
                stdio: ["ignore", out, err]
            }));
            sub_process[i - 1].unref();
            console.log(`sub-process detached for ${hour,minute}`);
            resolve();
        }
        catch (e) {
            console.log(e);
            reject();
        }
    });
}



module.exports = sleepTime;