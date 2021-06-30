const { spawn } = require("child_process");
const schedule = require('node-schedule');
// const times = require("./../jsonFiles/times.json");
const createNotification = require("./showNotification.js");
const storePID = require("./../detachedProcessHandlers/storePID.js");
const fs = require("fs");
(async () => {
  try {
    await storePID(process.pid, "sleepTime");
  }
  catch (e) {
    process.exit();
  }
  let times;
  try {
    times = await readFile();
  }
  catch (e) {
    console.error("Could not Read times.json file to Schedule Job\n Error is ====>\n"+e);
    process.exit();
  }
  console.log(times);
  let notificationProperties = {    //properties of notification to show
    title: `It is Time to Sleep`,
    message: " msg",
    icon: ".//resources//icon.png",
    sound: true,
    actions: ["Ok", "Snooze"]
  };
  for (let i = 0; i < 4; i++) {
    console.log(`job scheduled for  ${times[i]["hour"]} ${times[i]["minute"]}`);  // this outpur will show in sleepOut.log
    await scheduleNotification(notificationProperties, times[i]["minute"], times[i]["hour"]);  //this will schedule notification one by one 
  }
  process.exit();
})();

async function scheduleNotification(properties, minute, hour) {
  return new Promise(async (resolve) => {
    schedule.scheduleJob(`${minute} ${hour} * * *`, async () => { // job is scheduled for specified time
      try {
        await createNotification(properties);  //show notification at specified time .. this will wait here till notification return resolve
        resolve();
      }
      catch (e) {
        // user selected ok which means he dont want want further notifications
        process.exit();
      }
    });
  })
}

async function readFile() {
  return new Promise(async (resolve, reject) => {
    fs.readFile("./jsonFiles/times.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    })
  })
}