const fs = require("fs");
//by write of this file a change trigger will be listned by watcher
(async (action) => {
    fs.readFile("./jsonFiles/controls.json", "utf8", async (err, data) => {
        let arr = [];
        let obj = JSON.parse(data)[0];
        if (obj[action] == undefined) {
            console.log("Please Enter Correct Command");
            process.exit();
        }
        for (k in obj) {
            if (k === action) {
                obj[k] = true;
            }
        }
        arr.push(obj);
        fs.writeFile("./jsonFiles/controls.json", JSON.stringify(arr), async (err) => {
            if (err)
                console.log("Can not write to File");
        })
    })
})(process.argv[2]);