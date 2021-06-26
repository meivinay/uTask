const schedule = require('node-schedule');
const createNotification = require("./notifier.js");
let jobs = [];
let minute = process.argv[2];
let hour = process.argv[3];
(async (minute, hour) => {
  let notificationProperties = {    //properties of notification to show
    title: `It is Time to Sleep`,
    message: " msg",
    icon: ".//resources//icon.png",
    sound: true,
    actions: ["Ok", "Cancel"]
  }
  jobs.push(schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
    createNotification(notificationProperties);  //show notification at specified time and exit after 7 seconds
    setTimeout(() => process.exit(), 7000);
  }));

  console.log(`Job schedule for ${hour} ${minute}`);

})(minute, hour);
