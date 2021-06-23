const puppeteer = require('puppeteer');
const scheduleSleep=require("./jobSchedule.js");
let hour=3;
let minute=20;
let ampm="AM";
hour=removeLeadingZero(hour);
minute=roundoffMinutes(minute);
ampm=capitalize(ampm);
let timings={};
(async () => {
    const browser = await puppeteer.launch({headless:false,defaultViewport:null,args:["--start-maximized"],sloMo:500});
  let pages = await browser.pages();
  let page=pages[0];
  await page.goto('https://sleepyti.me/');

await page.select("#hour",`${hour}`)
await page.select("#minute",`${minute}`);
await page.select("#ampm",`${ampm}`);
await page.click("#calculate");
await page.waitForTimeout(4000);
await page.waitForSelector("#result4",{visible:true});
    for(let i=1;i<=4;i++)
    {
        let time=await page.evaluate(function(i){ return document.querySelector(`#result${i}`).innerText},i);
        console.log(time);
        let hourIntwentyfourHourFormat=timeFormatChange(time.split(":")[0],time.split(" ")[1]);
        let minute=time.split(":")[1].split(" ")[0];
        scheduleSleep(minute,hourIntwentyfourHourFormat);
    }
   
    
})();

function roundoffMinutes(minute)
{
    return Math.ceil(minute/5)*5;
}
function removeLeadingZero(hour)
{
    if(hour<10)
    return hour%10;
}
function capitalize(str)
{
    return str.toUpperCase();
}

function timeFormatChange(hour,ampm)
{
    if(ampm==="AM" && hour==12) return Number(hours)-12;
    if(ampm==="PM" && hour<12) return Number(hour)+12;

    return hour;
}