const fs=require("fs");
async function storePID(pid,processName)
{
  return new Promise((resolve,reject)=>
  {
    fs.readFile("./jsonFiles/processIDs.json","utf8",(err,data)=>   //ye path relative to index.js hai ,,, index.js->launchYT.js->yt.js->storPID.js detach hone ke baad bhi usne apna relative path nhi bnaya, apne parent ka relative path bnaya
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
