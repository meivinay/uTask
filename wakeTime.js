const puppeteer = require("puppeteer");
const inquirer = require("inquirer");
const moment = require("moment");
const chalk = require("chalk");
const login = require("./login.js");
let wakeupTimings = [];

async function wakeTime() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"], slowMo:80 });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto('https://sleepyti.me/');
    await page.click("#zzz");
    await page.waitForTimeout(4000);
    await page.waitForSelector("#resultNow6", { visible: true });
    for (let i = 1; i <= 6; i++) {
        let time = await page.evaluate(function (i) { return document.querySelector(`#resultNow${i}`).innerText }, i);
        wakeupTimings.push(time);
    }
    printTimings(wakeupTimings);

    let userInput = await getUserInput();
   
    let calendarDateFormat = await convertUserInput(userInput.Date);
    console.log(calendarDateFormat);
    let isSet = await getChoice();
    if (isSet == true) {
        await setReminder(browser, calendarDateFormat[0], calendarDateFormat[1]);
    }
    await page.waitForTimeout(1000);
   await page.close();
};

function printTimings(wakeupTimings) {
    console.log("You should set Alarm for any of these Timings");
    for (let i = 0; i < wakeupTimings.length; i++) {
        console.log(wakeupTimings[i]);
    }
}

async function getUserInput() {
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

async function convertUserInput(userDate) {
    return new Promise((resolve, reject) => {
        let dateTime = moment(userDate);
        dateTime = dateTime.format("MMM D YYYY,h:mma");
        date = dateTime.split(",")[0].trim();
        time = dateTime.split(",")[1].trim();
        let finalDateTime = [];
        finalDateTime.push(date);
        finalDateTime.push(time);
        resolve(finalDateTime);
    }
    )

}

async function getChoice() {
   return new  Promise((resolve,reject)=>
   {
    const prompt = inquirer.createPromptModule();
    prompt({
        type: "list",
        name: "choice",
        message: `Do you want to set Reminder in Google Calendars.${chalk.red('Note=>')} if Yes,you should set a long length notification tone for reminders`,
        choices: ["Yes", "No"]
    })
        .then((answer) => {
            if (answer.choice === "Yes") {
               resolve(true);
            } else {
                reject(process.exit());
            }
        })
}) 
}
async function setReminder(browser, date, time) {
    return new Promise(async (resolve, reject) => {
        let newpage = await browser.newPage();
        await newpage.goto("https://www.google.com/calendar/about/");
        await login(newpage);
        let box = await newpage.$('[aria-label="Create"]');
        await box.click();
        await newpage.waitForSelector(".XSQHmd", { visible: true });
        await newpage.waitForSelector("[aria-label='Add title']", { visible: true });
        await newpage.type("[aria-label='Add title']", "Pep_Hack Alarm");
        let tabList = await newpage.$$(".XSQHmd");
        let reminderButton = tabList[2];
        await reminderButton.click();
        await newpage.type("#xStDaIn", date);
        await newpage.type("#xStTiIn", time);
        await newpage.click(".uArJ5e.UQuaGc.Y5sE8d.pEVtpe");
        resolve(newpage.close());
    })

}
module.exports= wakeTime;