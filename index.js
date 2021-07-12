#!/usr/bin/env node
const getSleepTime = require("./sleepUtility/getSleepTime.js");
const getWakeupTime = require("./sleepUtility/getWakeUpTime.js");
const splitTime = require("./sleepUtility/splitTime.js");
const launchYouTube = require("./youtube/launchYoutube.js");
const killTask = require("./detachedProcessHandlers/killTask.js");
const control = require("./detachedProcessHandlers/control.js");
const fs = require("fs");
const reminder = require("./calendar/reminder.js");
let input = process.argv.slice(2);

(async () => {
    let time;
    if (input.length > 2 || input.length == 0) {
        console.log("Command not found");
        return;
    }
    else {

        let firstChar = input[0].charAt(0);
        if (firstChar === "-") {
            if (input[0] === "-s") {
                try {
                    if (input[1].includes(".") == true) {
                        console.log("Invalid Input");
                        return;
                    }
                    time = await splitTime(input[1])
                }
                catch (e) {
                    console.log(e);
                    return;
                }
                if (isTimeValid(time)) {
                    let hour = Number(time[0]);
                    let minute = roundoffMinutes(Number(time[1]));
                    let period = time[2].toUpperCase();
                    getSleepTime(hour, minute, period);
                }
                else {
                    console.log("Please Enter Valid Time");
                }
            }
            else if (input[0] === "-w") {
                getWakeupTime();
            }
            else if (input[0] === "-yt") {
                if (input[1] === "resume") {
                    fs.readFile("./jsonFiles/resumePlaylist.json", "utf8", async (err, data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        console.log("opening");
                        let recent = JSON.parse(data)[0];
                        await launchYouTube(recent["url"]);
                    })
                }
                else {
                    await launchYouTube(input[1]);
                }
            }
            else if (input[0] === "-kill") {
                killTask(input[1]);
            }
            else if (input[0] === "-c") {
                control(input[1]);
            }
            else if (input[0] === "-r") {
                reminder();
            }
            else {
                console.log("Not a valid option");
            }
        }
        else {
            console.log("Not a valid command");
        }
    }
})();

function isTimeValid(time) {
    let isHourValid = false;
    let isMinuteValid = false;
    let isPeriodvalid = false;

    let hour = Number(time[0]);
    if (hour >= 1 && hour <= 12)
        isHourValid = true;


    let minute = Number(time[1]);
    if (minute >= 0 && minute < 60)
        isMinuteValid = true;


    let period = time[2];
    if (period === 'am' || period === 'pm' || period === 'AM' || period === 'PM')
        isPeriodvalid = true;

    if (isHourValid && isMinuteValid && isPeriodvalid)
        return true;
    else
        return false;
}

function roundoffMinutes(minute) {
    if (minute === 5) {
        return 5;
    }
    return Math.ceil(minute / 5) * 5;

}
