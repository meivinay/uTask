const moment = require("moment");

async function convertDateTime(userDate) {
    return new Promise((resolve, reject) => {
        let dateTime = moment(userDate);
        dateTime=dateTime.add(20,"m");
        dateTime = dateTime.format("MMM D YYYY,h:mma");
        date = dateTime.split(",")[0].trim();
        time = dateTime.split(",")[1].trim();
        let finalDateTime = [];
        finalDateTime.push(date);
        finalDateTime.push(time);
        resolve(finalDateTime);
    })
}

module.exports = convertDateTime;