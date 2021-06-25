const creditionals=require("./logInfo.js");
async function login(page) {
    return new Promise(async (resolve, reject) => {
        await page.waitForTimeout(4000);
        await page.click(".signin-btn");
        await page.waitForSelector("#identifierId",{visible:true})
        await page.type("#identifierId",creditionals.userName);
        await page.click(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb");
        await page.waitForTimeout(3000);
        await page.waitForSelector(".VfPpkd-RLmnJb", { visible: true });
        await page.type(".whsOnd.zHQkBf",creditionals.pass);
        await page.click(".VfPpkd-RLmnJb");
        await page.waitForTimeout(7000);
        resolve();
    
})
}

module.exports=login;