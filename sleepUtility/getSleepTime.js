const puppeteer = require('puppeteer');
const fs = require("fs");
const { spawn } = require("child_process");
const moment=require("moment");
async function sleepTime(hour, minute, period) {
    const browser = await puppeteer.launch({ headless: false });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto('https://sleepyti.me/');
    await page.select("#hour", `${hour}`);
    if(minute<10)
    {
        minute="0"+minute;
    }
    await page.select("#minute", `${minute}`);
    await page.select("#ampm", `${period}`);
    await page.waitForTimeout(1000);
    await page.click("#calculate");
    await page.waitForTimeout(4000);
    await page.waitForSelector("#result4", { visible: true });
    let times = [];
    for (let i = 1; i <= 4; i++) {
        let time = await page.evaluate((i) => { return document.querySelector(`#result${i}`).innerText }, i);
    //     time=moment(time) //wrape with moment module to manipulate time
    //    time=time.
        let hour = Number((timeFormatChange(time.split(":")[0], time.split(" ")[1]))); // extract hour and period from scrapped time and change to 24 hour format
        let minute = Number(time.split(":")[1].split(" ")[0]); //extracct minute from scrapped time
        if((minute-20)>=0){         //show notification 20 minutes before scrapped time
            minute=minute-20;
            }
            else{
                hour=hour-1;
                minute=60+(minute-20);
            }
        let obj = {
            "hour": hour,
            "minute": minute
        }
        times.push(obj);
    }
    await createjson(times, page); //creating json files so can get at which time to showNotification
    try {
        const jobOut = fs.openSync("./log/sleepOut.log", "a") //creating streams for detached process
        const jobErr = fs.openSync("./log/sleepErr.log", "a")
        let subProcess = spawn(process.argv[0], ["sleepUtility/scheduleNotification.js"], {
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