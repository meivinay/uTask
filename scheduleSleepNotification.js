const schedule = require('node-schedule');
const createNotification = require("./notifier.js");
let jobs = [];
let minute = process.argv[2];
let hour = process.argv[3];
(async function sleepSchedule(minute, hour) {
  jobs.push(schedule.scheduleJob(`${minute} ${hour} * * *`, function () {
      createNotification();
      setTimeout(() => process.exit(), 7000);
  }));

  console.log(`Job schedule for ${hour} ${minute}`);

})(minute, hour);
