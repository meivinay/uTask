const login = require("./login.js");
const getReminderTitle = require("./reminderTitle.js");
const getReminderDateTime = require("./reminderDate.js");
const convertDateTime=require("./convertDate.js");
const puppeteer=require("puppeteer");
async function setReminder() {
    return new Promise(async (resolve, reject) => {
        let reminderDate = await getReminderDateTime();
        let calendarDateFormat = await convertDateTime(reminderDate.Date);
        console.log(`Creating Reminder for  ${calendarDateFormat[1]} , ${calendarDateFormat[0]}`);
        let reminderTitle = await getReminderTitle();
        const browser = await puppeteer.launch({ headless: true,  defaultViewport: null, args: ["--start-maximized"],slowMo: 10 });
        let pages = await browser.pages();
        let page = pages[0];
        page.on("framenavigated", async () => {
            setTimeout(async() => {
               await page.screenshot({ path: "./debug/calendar.png" }); // visual of last visited page for debugging purposes , use cautious , may be code not was working because of this
            }, 2000);
        }); 
        await page.goto("https://www.google.com/calendar/about/");
        await login(page);
        await page.waitForTimeout(8000);
        let box = await page.$('[aria-label="Create"]');
        await box.click();
        await page.waitForTimeout(3000);
        await page.waitForSelector(".XSQHmd", { visible: true });
        await page.waitForTimeout(3000);
        await page.waitForSelector("[aria-label='Add title']", { visible: true });
        console.log("typing reminder Title");
        await page.type("[aria-label='Add title']", reminderTitle);
        let tabList = await page.$$(".XSQHmd");
        await page.waitForTimeout(3000);

        let reminderButton = tabList[2]; //choosing reminder out of event,task,reminder
        if (reminderButton == undefined) {
            console.log("please try again");
            process.exit();
        }
        await page.waitForTimeout(4000);

        await reminderButton.click();
        await page.waitForTimeout(3000);

        console.log("Setting Date & Time");
        //await newpage.screenshot({path:"./xt.png"})
        await page.type("#xStDaIn", date);
        await page.waitForTimeout(1000);
        //await newpage.screenshot({path:"./date.png"})
        await page.type("#xStTiIn", time);
        await page.waitForTimeout(1000);
        // await newpage.screenshot({path:"./time.png"})
        await page.click(".uArJ5e.UQuaGc.Y5sE8d.pEVtpe");
        //await newpage.screenshot({path:"./saved.png"});
        resolve();
        await process.exit();
    })

}

module.exports = setReminder;