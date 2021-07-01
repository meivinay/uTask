const fs= require("fs");

async function showAlert(){
    return new Promise(resolve=>{
        fs.readFile("./detachedProcessHandlers/alert.txt","utf8",(error,data)=>{
            if(error)
            {
                console.log("Can not read alert.txt");
            }
            else{

                console.log(data);
            }
            resolve();
        })
    })
}

module.exports=showAlert;