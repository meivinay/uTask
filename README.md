Welcome to uTask

I have tried to automate some of the basic micro task we may perform on daily basis using nodejs.\
The goal of this project in not just automate some uTask but to run in background and not to make user
worry about accidentaly closing the uTask or take space in recent open tab/windows where already many\
tab/windows are opened, this gives user a minimalist feel. Also by using this we won't have to take our hands of
out keyboard because there are many option provided to control the application.

The main and important feature of this project are
1. Do not block access to terminal while uTask runnig in background.
2. Do not close when terminal is closed.
3. Programs Send/Recieve information between each other.
4. Do not run a Process again if its already running 

These micro Task or uTask that can be performed using this project are
1. Set Sleep or WakeUp Schedule
2. Set Reminder in Google Calendars
3. Listen to Podcast,Music playlist or some Chill type beats/songs on YouTube.

Note-> All of these task run in background and headless so your terminal won't get blocked. You can use command lines (see usage) to kill/purge background running uTask.

Why ?
1. Sometimes even after a long very long nap,or going early to bed we feel very lazy.\
   The reason is our sleep has Cycles and if our sleep cycles disturbs we will fail more lazy\
   throughout the day even we had enough sleep.\
   Using uTask we can set notification or reminders to notify ourself to sleep or wakeup for\
   a more productive day.

2. We all use Reminders to obviously remind ourself about something on a particular Day and Time.\
   Using uTask i tried to automate this process that we perform on daily basis that may save us some
   time and mouse clicks.

3. Some of us love to listen to something while working while some want a silent enviourment to work.\
   This is for the people who want to listen to his/her favourite Music playlist,Podcast or some other
   sound on YouTube during work and also avoid distraction by looking away from work screen to perform
   some action.

Details
1. SleepUtility\
Scrap Best possible Timing to sleep or wakeup from https://sleepyti.me so you won't feel lazy even after a long nap\
    1.1 Ask for a time you want to wake up at and than it will send you Windows Toast notification 20 minutes prior\
        to scheduled time for Sleep. You can Snooze the notification and than it show up on next nearest best Sleep\
        Schedule.\
    1.2 If you want to Sleep right away and want the best timing to wake up. Than it will provide you some time\
        and than you pick any of these or can decide for yourself. It will set reminder to wake you up and given time.

2. Reminder\
   2.1 This simply add reminders to google Calendar. We can say it it stand alone part of 1.2 .

3. YouTube\
Provide a URL of a YouTube playlists first video Or Podcast and will play it for you while not blocking your working screen area.\
    3.1 Play playlist or video on YouTube show notification for first video with video thumbnail.\
    3.2 Resume last played video.\
    3.4 Gives you acces to YouTube playback controls using command line. (see usage)\
    3.5 You can also control playback using keyboard multimedia keys.\
    3.6 Skip ad if any just after they show up.

Usage
1. Sleeputility\
   1.1 Uses    => -s Option and take time in 12 hour format as a String argument\
       Example => uTask -s "6:00 am"\
       Output  => Several Windows Toast Notification 20 minutes prior to actual Sleep time.\
                  So you can plan accordingly. You can cancel or snooze notification by pressing\
   1.2 Uses    => -w Option and provide you suggested time to wake up with 20 minutes already added to them.\
       Example => uTask -w\
       Output  => Suggested Time List\
                  Ask You if you want to Set a Reminder or Not.\
                  Ask for what time you want to Set Reminder.\
                  Set reminder in google calendar
2. Reminder\
   2.1 Uses    => -r Option\
       Example => uTask -r\
       Output  => Ask You if you want to Set a Reminder or Not.\
                  Ask for what time you want to Set Reminder.\
                  Set reminder in google calendar.
3. YouTube\
   3.1 Uses    =>  -yt Option and take URL of YouTube Video as a String argument\
       Example =>  -yt "<URL>"\
       Output  =>   Run a detached process which plays given URL video in chromius headless mode\
                    Show Windows Toast Notification with video thumbnail as icon for very first played video.
   
   3.2 Uses    =>  -yt Option with "resume" as String argument\
       Example =>  -yt "resume"\
       Output  =>   Run a detached process which plays last played video in chromium headless mode also show thumbnail

   3.3 Uses    =>   -c Option and take "shortcutKey" as a String argument\
       Example =>   -c "P"\
       Output  =>   play previous video in the playlist(if any)

To kill any of the above task use following command on your Terminal => uTask -kill "taskName"\
Example => uTask -kill "youtube"\
                 OR\
           uTask -kill "sleepTime"

List Shortcut Keys for YouTube playback =>

"S"  start/stop OR play/pause\
"N"  jump to Next Video in Playlist\
"P"  jump to Previous Video in Playlist\
"M"  Mute/Unmute\
"B"  Seek 10 Seconds Backward in Video\
"F"  Seek 10 Seconds Forward in Video\
"U"  Faster Playback Speed OR Speed Up\
"D"  Slower Playback Speed OR Slow Down\
"H"  Jump to Beginnig of current video\
"E"  Jump to End of current video

*You can also use your keyboard mutimedia key for playback actions(This feature is not implemented by this program)

How?

In development of  this project i have used several npm or in-built node packages. Some of these are\
1. Puppeteer\
  Used to scrap/load data from websites.
2. fs\
   Access local file System.
3. child-process\
   To spawn child-process as a detached process so it will no longer block Terminal access.
4. node-notifier\
   Show Windows Toast Notification.
5. node-schedule\
   Execute a command at particular given time.
6. chokidar\
   Listen for update in File System.
7. inquirer\
   Take user Input at run-time.
8. is-running\
   Check if a Process with given Process ID is running or not.

By using above packages i have a created a little environment which can send/recieve data among running process. So that even a process is detached and you no longer have direct access to it, you can still give commands to the child process. 
for example- When we launch YouTube in our project it loads in puppeteer , we can not access playback directly. So i write some small programs which send/recieve commands to puppeteer to perfom required actions.\
I also implement a small program to kill these background processes when these are no longer needed.\
Only those task which used google reminder will not run in background. There are high chances that google will block our program at any level of processing. Also keeping in mind Reminders are very important notifications, we can not let any type failure during setting a reminder or user can loose some important information.

This project has taught me to-
1. Access/Update File System.
2. Scrap Data from a website.
3. Automate a process.
4. Create Child-processes.
5. Message passing.
6. Manipulate processes using their Process Ids.
7. Write a modular and clean code.
8. Divide large Programs in small easily managable small sub-programs.