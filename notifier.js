const WindowsToaster = require('node-notifier').WindowsToaster;
function notify(properties) {
  var notifier = new WindowsToaster({
    withFallback: false, // Fallback to Growl or Balloons?
    customPath: undefined // Relative/Absolute path if you want to use your fork of SnoreToast.exe
  });

  notifier.notify(properties,(error, response)=> {
      if (error)
        console.log(error);
    }
  );
  notifier.on("ok", () => {
    console.log("Ok is pressed");
  });
  notifier.on("cancel", () => {
    console.log("Cancel is pressed");
  });
  notifier.on('timeout', () => {
    console.log('Timed out!');
  });
};

module.exports=notify;