const WindowsToaster = require('node-notifier').WindowsToaster;
async function notify(properties) {
  return new Promise(async (resolve, reject) => {
    var notifier = new WindowsToaster({
      withFallback: false, // Fallback to Growl or Balloons?
      customPath: undefined // Relative/Absolute path if you want to use your fork of SnoreToast.exe
    });
    console.log("inside nitifer");
    notifier.notify(properties, (error, response) => {});
    notifier.on("ok", () => {
      process.exit();
    });
    notifier.on("Snooze", () => {
          resolve();
    });
    notifier.on('timeout', () => {
      process.exit();
  })
})
};

module.exports = notify;