const creditionals = require("./logInfo.js");
async function login(page) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("trying to Login To Google Calendar");
            await page.waitForTimeout(4000);
            await page.click(".signin-btn");
            await page.waitForSelector("#identifierId", { visible: true })
            console.log("typing User Name");
            await page.type("#identifierId", creditionals.userName);
            await page.click(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb");
            await page.waitForTimeout(3000);
            await page.waitForSelector(".VfPpkd-RLmnJb", { visible: true });
            console.log("typing Password");
            await page.type(".whsOnd.zHQkBf", creditionals.pass);
            await page.click(".VfPpkd-RLmnJb");
            console.log("Logged in");
            resolve();
        }
        catch (e) {
            console.log("No response from Google Please Try again /n Error is ===>>>/n" + e);
            process.exit();
        }
    })
}

module.exports = login;