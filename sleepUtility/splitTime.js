async function splitTime(time) {
    let finalTime = [];
    return new Promise((resolve, reject) => {
        if (time.length > 8) {
            reject("Argument length is Too long");
        }
        else if (time.includes(":") && time.includes(" ")) {
            let hour = time.split(":")[0].trim();    //extract hours part
            let minute = time.split(":")[1].split(" ")[0].trim(); //extract minute
            let period = time.split(" ")[1].trim(); //extract period
            finalTime.push(hour);
            finalTime.push(minute);
            finalTime.push(period);
            resolve(finalTime);
        }
        else {
            reject("Not a Valid time")
        }
    })
}

module.exports = splitTime;