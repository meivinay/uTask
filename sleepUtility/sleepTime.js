const puppeteer = require('puppeteer');
const fs = require("fs");
const { spawn } = require("child_process");

async function sleepTime(hour, minute, period) {
    const jobOut = fs.openSync("./log/sleepOut.log", "a")
    const jobErr = fs.openSync("./log/sleepErr.log", "a")
    const browser = await puppeteer.launch({ headless: true });
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
        let hourIntwentyfourHourFormat = (timeFormatChange(time.split(":")[0], time.split(" ")[1])); // extract hour and period from scrapped time and change to 24 hour format
        let minute = Number(time.split(":")[1].split(" ")[0]); //extracct minute from scrapped time
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
        console.log(`You will be notified at ${times[0]["hour"]} ${[times[0]["minute"]]}`);
        await page.close();
        process.exit();
    }
    catch (e) {
        console.log("there was some problem creating a job, try again /Error is ===>" + e);
        await page.close();
    }
}
function timeFormatChange(hour, period) {
    if (period === "AM" && hour == 12)
        return Number(hour) - 12;

    if (period === "PM" && hour < 12)
        return Number(hour) + 12;

    return Number(hour);
}

async function createjson(times, page) {
    return new Promise(resolve => {
        fs.writeFile("./jsonFiles/times.json", JSON.stringify(times), async (err) => {
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