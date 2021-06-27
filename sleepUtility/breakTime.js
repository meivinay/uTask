
async function breakTime(time)
{
    let finalTime=[];
     return new Promise((resolve,reject)=>
     {
            if(time.length>8)
            {
                reject("Argument length is Too long");
            }
            else if(time.includes(":") && time.includes(" "))
            {
            let hour=time.split(":")[0].trim();
            let minute=time.split(":")[1].split(" ")[0].trim();
            let period=time.split(" ")[1].trim();
                finalTime.push(hour);
                finalTime.push(minute);
                finalTime.push(period);
                resolve(finalTime);
        }
        else
        {
            reject("Not a Valid time")
        }
        })
    }
    
module.exports=breakTime;