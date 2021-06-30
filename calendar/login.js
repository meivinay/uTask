const creditionals = require("./logInfo.js");  //below is structure of logininfo.js
//  {
//  userName:"username",
 //   pass:"password"
//  }

async function login(googleCalendar) {
    return new Promise(async (resolve, reject) => {
        try {
            await googleCalendar.waitForTimeout(4000);
            await googleCalendar.click(".signin-btn");
            let mail = creditionals.userName;
            let pass = creditionals.pass;
            await googleCalendar.waitForTimeout(3000);
            for (let i = 0; i < mail.length; i++) {
                await googleCalendar.keyboard.press(mail.charAt(i), { delay: 346 });
            }
            await googleCalendar.keyboard.press("Enter", { delay: 200 });
            await googleCalendar.waitForTimeout(2000);
            for (let i = 0; i < pass.length; i++) {
                await googleCalendar.keyboard.press(pass.charAt(i), { delay: 616 });
            }
            await googleCalendar.keyboard.press("Enter", { delay: 200 });
            await googleCalendar.waitForTimeout(4000);
            resolve();
        }
        catch (e) {
            console.log("No response from Google Please Try again /n Error is ===>>>/n" + e);
            process.exit();
        }
    })
}

module.exports = login;