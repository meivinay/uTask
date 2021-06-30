const WindowsToaster = require('node-notifier').WindowsToaster;
async function notify(properties) {
  return new Promise(async (resolve, reject) => {
    var notifier = new WindowsToaster();
    notifier.notify(properties, (error, response) => { });
    notifier.on("ok", () => {       // if OK pressed than exit process and do not show further notification
      reject();
    });
    notifier.on("Snooze", () => {     // if snooze pressed return resolve and schedule notification for next scrapped time
      resolve();
    });
    notifier.on('timeout', () => {      // if no response from user snooze
      resolve();
    })
  })
};

module.exports = notify;