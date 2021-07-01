const puppeteer = require('puppeteer');
const fs = require("fs");
const { spawn } = require("child_process");
const moment=require("moment");
const showAlert=require("./../detachedProcessHandlers/showAlert.js");
const chokidar=require("chokidar");

async function sleepTime(hour, minute, period) {
    const browser = await puppeteer.launch({ headless: true });
    let pages = await browser.pages();
    let sleepyTime = pages[0];
    await sleepyTime.goto('https://sleepyti.me/');
    await sleepyTime.select("#hour", `${hour}`);
    if(minute<10)
    {
        minute="0"+minute;
    }
    await sleepyTime.select("#minute", `${minute}`);
    await sleepyTime.select("#ampm", `${period}`);
    await sleepyTime.waitForTimeout(1000);
    await sleepyTime.click("#calculate");
    await sleepyTime.waitForTimeout(4000);
    await sleepyTime.waitForSelector("#result4", { visible: true });
    let times = [];
    for (let i = 1; i <= 4; i++) {
        let time = await sleepyTime.evaluate((i) => { return document.querySelector(`#result${i}`).innerText }, i);
    //     time=moment(time) //wrape with moment module to manipulate time
    //    time=time.
        let hour = Number((timeFormatChange(time.split(":")[0], time.split(" ")[1]))); // extract hour and period from scrapped time and change to 24 hour format
        let minute = Number(time.split(":")[1].split(" ")[0]); //extracct minute from scrapped time
        if((minute-20)>=0){         //show notification 20 minutes before scrapped time
            minute=minute-20;
            }
            else{
                if(hour!=0)
                hour=hour-1;
                minute=60+(minute-20);
            }
        let obj = {
            "hour": hour,
            "minute": minute
        }
        times.push(obj);
    }
    await browser.close();
    try{
    await createjson(times); //creating json files so can get at which time to showNotification
    }
    catch(e){
            console.log("Can not Write to times.json");
    }
try {
        const jobOut = fs.openSync("./log/sleepOut.log", "a") //creating streams for detached process
        const jobErr = fs.openSync("./log/sleepErr.log", "a")
        let subProcess = spawn(process.argv[0], ["sleepUtility/scheduleNotification.js"], {
            detached: true,
            stdio: ["ignore", jobOut, jobErr]
        });
        subProcess.unref();
        //let alert=`You will be notified at ${times[0]["hour"]} ${[times[0]["minute"]]}`
        const watcher = chokidar.watch("./detachedProcessHandlers/alert.txt", { persistent: true, awaitWriteFinish: true });
        watcher.on("change",async(path)=>{
            await showAlert();
            watcher.close();
            process.exit();
        })

        setTimeout(() => {
            console.log("Late Response,May be process already running,Please close previous process");
            watcher.close();
            process.exit();
        }, 5000);
    }
    catch (e) {
        console.log("There was some problem creating a job, try again /Error is ===>" + e);
        process.exit();
    }
}



function timeFormatChange(hour, period) {
    if (period === "AM" && hour == 12)
        return Number(hour) - 12;

    if (period === "PM" && hour < 12)
        return Number(hour) + 12;

    return Number(hour);
}

async function createjson(times) {
    return new Promise((resolve,reject) => {
        fs.writeFile("./jsonFiles/times.json", JSON.stringify(times), async (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve();
            }
        });
    })
}


module.exports = sleepTime;