const WindowsToaster = require('node-notifier').WindowsToaster;
function notify()
{
var notifier = new WindowsToaster({
  withFallback: false, // Fallback to Growl or Balloons?
  customPath: undefined // Relative/Absolute path if you want to use your fork of SnoreToast.exe
});

notifier.notify(
  {
    title: `Fear can keep us up all night long but faith makes one fine pillow.
 Philip Gulley`, // String. Required
   message: " msg", // String. Required if remove is not defined
    icon: undefined, // String. Absolute path to Icon
    sound: true, // Bool | String (as defined by http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx)
    id: undefined, // Number. ID to use for closing notification.
    appID: undefined, // String. App.ID and app Name. Defaults to no value, causing SnoreToast text to be visible.
    remove: undefined, // Number. Refer to previously created notification to close.
    install: undefined // String (path, application, app id).  Creates a shortcut <path> in the start menu which point to the executable <application>, appID used for the notifications.
  },
  function (error, response) {
    console.log(response);
  }
);
}

module.exports=notify;