const axios = require('axios');
const fs = require('fs');
const { url, reset_time } = require('../config.json');
const { autoMenuSent } = require('../var.json');

const { getData, getMenu, getDate } = require('./menu');
const { sendMenu } = require("./commands.js");
const { loadSendList, loadServers} = require("./servers");

async function updateMenu(){
    const response = await axios.get(url);
    const pageContent = response.data;

    let new_date = getDate(getData(pageContent));
    let old_data = getDate(getData(fs.readFileSync("../menu.html", "utf-8")));

    console.log(new_date);
    console.log(old_data);

    if(new_date !== old_data){
        fs.writeFileSync("../menu.html", pageContent);
        console.log("Updated menu data.");
        return true;
    } else {
        console.log("Same date, Updating postponed.");
        return false;
    }
}


function startIntervalCheck()
{
    let sent = autoMenuSent; // true is the menu has already been sent

    console.log("Lancement de la détection de l'heure...");
    sent = checkTime(sent);

    setInterval(() => {
        sent = checkTime(sent);
    }, 60000);
}

function checkTime(sent)
{
    let now = new Date();
    let reset = new Date("01/01/2000 " + reset_time);

    console.log("LOGS: " + reset.getHours() + ":" + reset.getMinutes());

    if (now.getHours() >= reset.getHours() && now.getMinutes() >= reset.getMinutes() && !sent) {
        sent = updateMenu(); // Update the menu and return true if the menu has been updated by Crous

        if(sent) {
            let list = loadServers();
            Object.values(list).forEach(server => {
                sendMenu(server.channelID);
            });

            fs.writeFileSync("../var.json", JSON.stringify({ autoMenuSent: true }, null, 2));
        }
    }

    if (reset.getHours() === now.getHours() && reset.getMinutes() === (now.getMinutes() +1)) {
        console.log("LOGS: Resetting found variable.");

        sent = false;
        fs.writeFileSync("../var.json", JSON.stringify({ autoMenuSent: false }, null, 2));
    }
    return sent;
}

module.exports = { startIntervalCheck, updateMenu };