const WindowsToaster = require('node-notifier').WindowsToaster;
(function notify()
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
    actions:["Ok","Cancel"] 
  },
  function (error, response) {
      if(error)
      console.log(error);
  }
);
notifier.on("ok",()=>
{
  console.log("Ok is pressed");
});
notifier.on("cancel",()=>
{
  console.log("cancel is pressed");
});
})();

//module.exports=notify;