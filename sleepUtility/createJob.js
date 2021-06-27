const { spawn } = require("child_process");
const schedule = require('node-schedule');
const times = require("./times.json");
const createNotification = require("./notifier.js");

  (async () => {
    let notificationProperties = {    //properties of notification to show
      title: `It is Time to Sleep`,
      message: " msg",
      icon: ".//resources//icon.png",
      sound: true,
      actions: ["Ok", "Snooze"]
    };
    for (let i = 0; i < 4; i++) {
      console.log(`job scheduled for ${times[i]["minute"], times[i]["hour"]}`);
      await scheduleNotification(notificationProperties, times[i]["minute"], times[i]["hour"]);
    }
    process.exit();
  })();

async function scheduleNotification(properties, minute, hour) {
  return new Promise((resolve) => {
    schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
      await createNotification(properties);  //show notification at specified time and exit after 7 seconds
      resolve();
    });
  })
}