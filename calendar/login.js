const creditionals = require("./logInfo.js");

async function login(page) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.waitForTimeout(4000);
            await page.click(".signin-btn");
            let mail = creditionals.userName;
            let pass = creditionals.pass;
            await page.waitForTimeout(2000);
            for (let i = 0; i < mail.length; i++) {
                await page.keyboard.press(mail.charAt(i), { delay: 346 });
            }
            await page.keyboard.press("Enter", { delay: 200 });
            await page.waitForTimeout(2000);
            for (let i = 0; i < pass.length; i++) {
                await page.keyboard.press(pass.charAt(i), { delay: 616 });
            }
            await page.keyboard.press("Enter", { delay: 200 });
            await page.waitForTimeout(4000);
            resolve();
        }
        catch (e) {
            console.log("No response from Google Please Try again /n Error is ===>>>/n" + e);
            process.exit();
        }
    })
}

module.exports = login;