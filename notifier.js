const WindowsToaster = require('node-notifier').WindowsToaster;
function notify()
{
var notifier = new WindowsToaster({
  withFallback: false, // Fallback to Growl or Balloons?
  customPath: undefined // Relative/Absolute path if you want to use your fork of SnoreToast.exe
});

notifier.notify(
  {
    title: `It is Time to Sleep`, 
   message: " msg", 
    icon: ".//resources//icon.png", 
    sound: true, 
    id: undefined, 
    appID: undefined, 
    remove: undefined, 
    install: undefined 
  },
  function (error, response) {
    console.log("Notification Response ==>"+response);
    if(error)
    {
      console.log(error);
    }
  }
);
}

module.exports=notify;