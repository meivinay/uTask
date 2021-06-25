let pup=require("puppeteer");
let url="https://www.youtube.com/watch?v=1HOyIJ084lk&list=PLuYF9B-tPehP0OPxcrKNMDG93rSi1W3vQ&index=53";
(async function()
{
    let browser=await pup.launch({headless:false,ignoreDefaultArgs: ["--mute-audio"]});
    let pages=await browser.pages();
    let page=pages[0];
    await page.goto(url);
    await page.waitForTimeout(5000);
    await page.click("#movie_player");
   await page.evaluate(()=>{
       setInterval(async()=>
    {
        
       let btnFound =document.querySelector(".ytp-ad-skip-button");
        if(btnFound)
        {
            console.log("btn found");
            btnFound.click();
        }
        else{
            console.log("button not found checking again");
        }
    }
    ,1020);   
   })
})();