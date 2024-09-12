const axios = require('axios');
const fs = require('fs');
const { url, catch_time_start, catch_time_end } = require('../config.json');

const { getData, getMenu, getDate } = require('./menu');
const { sendMenu } = require("./commands.js");
const { loadSendList, loadServers} = require("./servers");

async function updateMenu(){
    const response = await axios.get(url);
    const pageContent = response.data;

    let new_date = getDate(getData(pageContent));
    let old_data = getDate(getData(fs.readFileSync("../menu.html", "utf-8")));

    if(new_date !== old_data){
        fs.writeFileSync("../menu.html", pageContent);

        return true;
    } else {
        return false;
    }
}


async function startIntervalCheck()
{
    let sent = false;

    console.log("Starting interval check...");
    sent = await checkTime(sent);

    setInterval(async () => {
        sent = await checkTime(sent);
    }, 60000);
}

async function checkTime(sent)
{
    let now = new Date();
    let cts = new Date("01/01/2000 " + catch_time_start);
    let cte = new Date("01/01/2000 " + catch_time_end);

    if(sent) console.log("Menu already sent. Waiting for reset sent flag. (At: " + cts.getHours() + ":" + cts.getMinutes() + ")");

    if (now.getHours() >= cts.getHours() && now.getHours() <= cte.getHours() && !sent) {
        let updated = await updateMenu();
        console.log("Checking for update... (Crous updated ?: " + updated + ")");

        if(updated) {
            let list = loadServers();
            Object.values(list).forEach(server => {
                sendMenu(server.channelID);
            });

            let log = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + " - Menu sent.";
            fs.appendFileSync("../logs.txt", log + "\n");

            sent = true;
        }
    }

    if (cts.getHours() === now.getHours() && cts.getMinutes() === (now.getMinutes() +1)) {
        console.log("Resetting sent flag.");
        sent = false;
    }

    return sent;
}

module.exports = { startIntervalCheck, updateMenu };