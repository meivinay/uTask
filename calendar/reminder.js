const login = require("./login.js");
const getReminderTitle = require("./reminderTitle.js");
const getReminderDateTime = require("./reminderDate.js");
const convertDateTime=require("./convertDate.js");
const puppeteer=require("puppeteer");

async function setReminder() {
        let reminderDate = await getReminderDateTime();
        let calendarDateFormat = await convertDateTime(reminderDate.Date);
        console.log(`Creating Reminder for  ${calendarDateFormat[1]} , ${calendarDateFormat[0]}`);
        let reminderTitle = await getReminderTitle();
        const browser = await puppeteer.launch({ headless: true,  defaultViewport: null, args: ["--start-maximized"],slowMo: 10 });
        let pages = await browser.pages();
        let googleCalendar = pages[0];
        // googleCalendar.on("framenavigated", async () => {
        //     setTimeout(async() => {
        //        await googleCalendar.screenshot({ path: "./debug/calendar.png" }); // visual of last visited page for debugging purposes , use cautious , may be code not was working because of this
        //     }, 2000);
        // }); 
        await googleCalendar.goto("https://www.google.com/calendar/about/");
        await login(googleCalendar);
        await googleCalendar.waitForTimeout(8000);
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
        await googleCalendar.waitForTimeout(2100);
        console.log("Reminder is Saved");
        process.exit();

}

module.exports = setReminder;