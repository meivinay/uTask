const fs=require("fs");

async function writeAlert(alert,data){
    return new Promise(resolve=>{
        if(data!=undefined)
        {
            alert=alert+"\nNotification will shown at";
            for(idx in data){
                alert=alert+`\n${data[idx]["hour"]}:${data[idx]["minute"]}`;
            }
        }
        fs.writeFile("./detachedProcessHandlers/alert.txt",alert,(e)=>
        {
            if(e)
            console.log("Can not write to alert");
        })
        resolve();
    })
}

module.exports=writeAlert;