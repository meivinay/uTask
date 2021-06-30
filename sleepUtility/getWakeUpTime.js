const puppeteer = require("puppeteer");
const chalk = require("chalk");
const inquirer = require("inquirer");
//const getReminderDateTime = require("./../calendar/reminderDate.js");
const getReminderTitle=require("./../calendar/reminderTitle.js");
const convertDateTime = require("./../calendar/convertDate.js");
const login=require("./../calendar/login.js")
async function wakeTime() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"], slowMo: 80 });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto('https://sleepyti.me/');
    await page.click("#zzz");
    await page.waitForTimeout(4000);
    await page.waitForSelector("#resultNow6", { visible: true });
    let wakeupTimings = [];
    for (let i = 1; i <= 6; i++) {
        let time = await page.evaluate((i) => { return document.querySelector(`#resultNow${i}`).innerText }, i);
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
    await page.waitForTimeout(3000);
    console.log("Reminder is Set");
    await browser.close();
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
        let newpage = await browser.newPage();
        // newpage.on("framenavigated", async () => {
        //     setTimeout(() => {
        //         newpage.screenshot({ path: "./debugYoutube/calendar.png" }); // visual of last visited page for debugging purposes , use cautious , may be code not was working because of this
        //     }, 2000);
        // }); /
        await newpage.goto("https://www.google.com/calendar/about/");
        await newpage.waitForTimeout(1000);
        await login(newpage);
        await newpage.waitForTimeout(7000);
        let box = await newpage.$('[aria-label="Create"]');
        await box.click();
        await newpage.waitForTimeout(1000);
        await newpage.waitForSelector(".XSQHmd", { visible: true });
        await newpage.waitForTimeout(1000);

        await newpage.waitForSelector("[aria-label='Add title']", { visible: true });
        console.log("typing reminder Title");
        await newpage.type("[aria-label='Add title']", reminderTitle);
        let tabList = await newpage.$$(".XSQHmd");
        await newpage.waitForTimeout(1000);

        let reminderButton = tabList[2]; //choosing reminder out of event,task,reminder
        if (reminderButton == undefined) {
            console.log("please try again");
            process.exit();
        }
        await newpage.waitForTimeout(1000);

        await reminderButton.click();
        await newpage.waitForTimeout(1000);

        console.log("Setting Date & Time");
        //await newpage.screenshot({path:"./xt.png"})
        await newpage.type("#xStDaIn", date);
        await newpage.waitForTimeout(1000);
        //await newpage.screenshot({path:"./date.png"})
        await newpage.type("#xStTiIn", time);
        await newpage.waitForTimeout(1000);
        // await newpage.screenshot({path:"./time.png"})
        await newpage.click(".uArJ5e.UQuaGc.Y5sE8d.pEVtpe");
        //await newpage.screenshot({path:"./saved.png"});
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

module.exports = wakeTime;