const WindowsToaster = require('node-notifier').WindowsToaster;
async function notify(properties) {
  return new Promise(async (resolve, reject) => {
    var notifier = new WindowsToaster();
    notifier.notify(properties, (error, response) => {});
    notifier.on("ok", () => {
      reject();
    });
    notifier.on("Snooze", () => {
          resolve();
    });
    notifier.on('timeout', () => {
      resolve();
  })
})
};

module.exports = notify;