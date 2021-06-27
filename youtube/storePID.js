const fs=require("fs");
async function storePID(pid,processName)
{
  return new Promise((resolve,reject)=>
  {
    fs.readFile("./jsonFiles/processIDs.json","utf8",(err,data)=>
   {
        
        let fileData=JSON.parse(data);
        if(fileData[0][processName]==undefined || require("is-running")(fileData[0][processName])==false)
        {
            fileData[0][processName]=pid;
            
            fs.writeFile("./jsonFiles/processIDs.json",JSON.stringify(fileData),(err)=>
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
            console.error(`${processName} is already running. Use killTask.js <"processName"> to kill running process`);
            reject();
        }
   })
  })
   
};
module.exports=storePID;
