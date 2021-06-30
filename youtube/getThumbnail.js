async function getThumbnail(browser, youtube) {
    return new Promise(async (resolve, reject) => {
        let thumbnailLink = await youtube.evaluate(() => {
            let aTag = document.querySelector('[rel="image_src"]');
            let link = aTag.getAttribute("href");
            return link
        })
        let thumbnailPage = await browser.newPage();
        try {
            await thumbnailPage.goto(thumbnailLink);
        }
        catch (e) {
            reject(e);
        }
        await thumbnailPage.screenshot({ path: "./resources/youtubeThumbnail.png" });
        await thumbnailPage.close();
        resolve();
    })
}
//only for first played video, to not fill notification center
module.exports = getThumbnail;