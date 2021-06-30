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
        await newpage.screenshot({ path: "./resources/youtubeThumbnail.png" });
        await newpage.close();
        resolve();
    })
}
//only for first video played, to not fill notification center
module.exports = getThumbnail;