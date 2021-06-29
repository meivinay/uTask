async function getThumbnail(browser, page) {
    return new Promise(async (resolve, reject) => {
        let thumbnailLink = await page.evaluate(() => {
            let aTag = document.querySelector('[rel="image_src"]');
            let link = aTag.getAttribute("href");
            return link
        })
        let newpage = await browser.newPage();
        try {
            await newpage.goto(thumbnailLink);
        }
        catch (e) {
            reject(e);
        }
        await newpage.screenshot({ path: "./resources/thumbnail.png" });
        await newpage.close();
        resolve();
    })
}
module.exports = getThumbnail;