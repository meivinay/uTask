const schedule = require('node-schedule');
const createNotification = require("./notifier.js");
let jobs = [];
function sleepSchedule(minute, hour) {
  //const date = new Date(2021, 5, 23, 13, i, 0); //year month date (month 0 to 11)
  jobs.push(schedule.scheduleJob(`${minute} ${hour} * * *`, function () {
    createNotification();
  }))
  console.log(`Job schedule for ${hour} ${minute}`);
  console.log("exit");
}
module.exports = sleepSchedule;