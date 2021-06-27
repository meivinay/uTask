const sleepTime = require("./sleepUtility/sleepTime.js");
const wakeTime = require("./sleepUtility/wakeTime.js");
const breakTime = require("./sleepUtility/breakTime.js");
const launchYT = require("./youtube/launchYT.js");
const recent=require("./jsonFiles/resumePlaylist.json");
let input = process.argv.slice(2);
let time;
(async () => {
    if (input.length > 2|| input.length ==0) {
        console.log("Command not found");
        return;
    }
    else {

        let firstChar = input[0].charAt(0);
        if (firstChar === "-") {
            if (input[0] === "-s") {
                try {
                    time = await breakTime(input[1])
                }
                catch (e) {
                    console.log(e);
                    return;
                }
                if (isTimeValid(time)) {
                    let hour = Number(time[0]);
                    let minute = roundoffMinutes(Number(time[1]));
                    let period = time[2].toUpperCase();
                    sleepTime(hour, minute, period);
                }
                else {
                    console.log("Please Enter Valid Time");
                }
            }
            else if (input[0] === "-w") {
                wakeTime();
            }
            else if(input[0]==="-yt")
            {
                if(input[1]==="resume")
                {
                    await launchYT(recent[0]["url"])
                }
               await launchYT(input[1]);
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
    if (minute >= 0 && minute <= 60)
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
    return Math.ceil(minute / 5) * 5;

}
