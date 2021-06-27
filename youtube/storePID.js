const fs=require("fs");
async function storePID(pid,processName)
{
  return new Promise((resolve,reject)=>
  {
    fs.readFile("youtube/processIDs.json","utf8",(err,data)=>
   {
        
        let fileData=JSON.parse(data);
        if(fileData[0][processName]==undefined)
        {
            fileData[0][processName]=pid;
            
            fs.writeFile("youtube/processIDs.json",JSON.stringify(fileData),(err)=>
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve();
                }
            })
        }
        else{
            console.log("already running");
        reject(process.exit());
        }
   })
  })
   
};
module.exports=storePID;
