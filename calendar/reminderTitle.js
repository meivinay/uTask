const readline = require('readline');


async function getReminderTitle() {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Please Enter Reminder Title ", (answer) => {
            resolve(answer);
            rl.close();
        });
    })
}

module.exports=getReminderTitle;