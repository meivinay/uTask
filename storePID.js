const fs=require("fs");
async function storePID(pid,processName)
{
  return new Promise((resolve,reject)=>
  {
    fs.readFile("processIDs.json","utf8",(err,data)=>
   {
        
        let fileData=JSON.parse(data);
        if(fileData[0][processName]!=undefined)
        {
            reject(process.exit());
        }
        fileData[0][processName]=pid;
        
        fs.writeFile("processIDs.json",JSON.stringify(fileData),(err)=>
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
   })
  })
   
};
module.exports=storePID;
