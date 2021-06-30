const inquirer = require("inquirer");
async function getReminderDate() {
    return new Promise((resolve, reject) => {
        inquirer.registerPrompt("date", require("inquirer-date-prompt"));
        inquirer.prompt({
            type: "date",
            name: "Date",
            message: "Please Select a Date for Reminder"
        })
            .then((answer) => {
                resolve(answer);
            })
            .catch((e) => {
                reject(e);
            })
    })
}

module.exports=getReminderDate;