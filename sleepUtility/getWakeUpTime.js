const puppeteer = require("puppeteer");
const chalk = require("chalk");
const inquirer = require("inquirer");
const moment=require("moment");
const getReminderTitle=require("./../calendar/reminderTitle.js");
const login=require("./../calendar/login.js");
async function wakeTime() {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ["--start-maximized"], slowMo: 80 });
    let pages = await browser.pages();
    let sleepyTime = pages[0];
    await sleepyTime.goto('https://sleepyti.me/');
    await sleepyTime.click("#zzz");
    await sleepyTime.waitForTimeout(4000);
    await sleepyTime.waitForSelector("#resultNow6", { visible: true });
    let wakeupTimings = [];
    for (let i = 1; i <= 6; i++) {
        let time = await sleepyTime.evaluate((i) => { return document.querySelector(`#resultNow${i}`).innerText }, i);
        wakeupTimings.push(time);
    }
    await printTimings(wakeupTimings);
    let isSetReminder = await getChoice();
    if (isSetReminder == true) {
        let reminderDate = await getReminderDateTime();
        let calendarDateFormat = await convertDateTime(reminderDate.Date);
        console.log(`Creating Reminder for  ${calendarDateFormat[1]} , ${calendarDateFormat[0]}`);
        let reminderTitle = await getReminderTitle();
        await setReminder(browser, calendarDateFormat[0], calendarDateFormat[1], reminderTitle);
    }
    await sleepyTime.waitForTimeout(4000);
    console.log("Reminder is Set");
    process.exit();
};
async function printTimings(wakeupTimings) {
    return new Promise((resolve) => {
        console.log("You should set Alarm for One of these Timings");
        for (let i = 0; i < wakeupTimings.length; i++) {
            console.log(wakeupTimings[i]);
        }
        resolve();
    })
}



async function getChoice() {
    return new Promise((resolve, reject) => {
        const prompt = inquirer.createPromptModule();
        prompt({
            type: "list",
            name: "choice",
            message: `Do you want to set Reminder in Google Calendars.${chalk.red('\nNote=>')} if Yes,you should set a long length notification tone for reminders`,
            choices: ["Yes", "No"]
        })
            .then((answer) => {
                if (answer.choice === "Yes") {
                    resolve(true);
                }
                else {
                    reject(process.exit());
                }
            }
            )
    })
}
async function setReminder(browser, date, time, reminderTitle) {
    return new Promise(async (resolve, reject) => {
        let googleCalendar = await browser.newPage();
        // newpage.on("framenavigated", async () => {
        //     setTimeout(() => {
        //         newpage.screenshot({ path: "./debugYoutube/calendar.png" }); // visual of last visited page for debugging purposes , use cautious , may be code not was working because of this
        //     }, 2000);
        // }); /
        await googleCalendar.goto("https://www.google.com/calendar/about/");
        await googleCalendar.waitForTimeout(1000);
        await login(googleCalendar);
        await googleCalendar.waitForTimeout(7000);
        let box = await googleCalendar.$('[aria-label="Create"]');
        await box.click();
        await googleCalendar.waitForTimeout(2500);
        await googleCalendar.waitForSelector(".XSQHmd", { visible: true });
        await googleCalendar.waitForTimeout(1400);

        let tabList = await googleCalendar.$$(".XSQHmd");
        let reminderButton = tabList[2]; //choosing reminder out of event,task,reminder
        if (reminderButton == undefined) {
            console.log("please try again");
            process.exit();
        }
        await googleCalendar.waitForTimeout(1000);
        await reminderButton.click();
        await googleCalendar.waitForTimeout(1090);
        await googleCalendar.waitForSelector("[aria-label='Add title']", { visible: true });
        console.log("typing reminder Title");
        await googleCalendar.type("[aria-label='Add title']", reminderTitle);
        console.log("Setting Date & Time");
        await googleCalendar.type("#xStDaIn", date);
        await googleCalendar.waitForTimeout(1000);
        await googleCalendar.type("#xStTiIn", time);
        await googleCalendar.waitForTimeout(1000);
        await googleCalendar.click(".uArJ5e.UQuaGc.Y5sE8d.pEVtpe");
        resolve();
    })

}
async function getReminderDateTime() {
    return new Promise((resolve, reject) => {
        inquirer.registerPrompt("date", require("inquirer-date-prompt"));
        inquirer.prompt({
            type: "date",
            name: "Date",
            message: "Please Select a Date for Reminder"
        })
            .then((answer) => {
                resolve(answer);
            })
            .catch((e) => {
                reject(e);
            })
    })
}

async function convertDateTime(userDate) {       //this has different functnality than in ./../calendar/converDate.js
    return new Promise((resolve, reject) => {
        let dateTime = moment(userDate);
        dateTime=dateTime.add(20,"m");  
        dateTime = dateTime.format("MMM D YYYY,h:mma");
        date = dateTime.split(",")[0].trim();
        time = dateTime.split(",")[1].trim();
        let finalDateTime = [];
        finalDateTime.push(date);
        finalDateTime.push(time);
        resolve(finalDateTime);
    })
}
module.exports = wakeTime;