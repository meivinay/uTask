const puppeteer = require('puppeteer');
const fs = require("fs");
const { spawn } = require("child_process");
const jobOut = fs.openSync("./jobOut.log", "a")
const jobErr = fs.openSync("./jobErr.log", "a")
console.log("sleep time");

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
    let times = [];
    for (let i = 1; i <= 4; i++) {
        let time = await page.evaluate((i) => { return document.querySelector(`#result${i}`).innerText }, i);
        let hourIntwentyfourHourFormat = timeFormatChange(time.split(":")[0], time.split(" ")[1]);
        let minute = time.split(":")[1].split(" ")[0];
        let obj = {
            "hour": hourIntwentyfourHourFormat,
            "minute": minute
        }
        times.push(obj);
    }
    await createjson(times, page);
    try {
        let subProcess = spawn(process.argv[0], ["sleepUtility/createJob.js"], {
            detached: true,
            stdio: ["ignore", jobOut, jobErr]
        });
        subProcess.unref();
        console.log(`You will be notified at ${times[0]["hour"] [time[0]["minute"]]}`);
        await page.close();
    }
    catch (e) {
        console.log("there was some problem creating a job Please try again");
        await page.close();
    }
}
function timeFormatChange(hour, period) {
    if (period === "AM" && hour == 12)
        return Number(hour) - 12;

    if (period === "PM" && hour < 12)
        return Number(hour) + 12;

    return hour;
}

async function createjson(times, page) {
    return new Promise(resolve => {
        fs.writeFile("sleepUtility/times.json", JSON.stringify(times), async (err) => {
            if (err) {
                console.log("Cant write File");
                await page.close();
            }
            else {
                resolve();
            }
        });
    })
}


module.exports = sleepTime;