const fs = require('fs');

function loadServers() {
    try {
        const fileData = fs.readFileSync("../servers.json", "utf-8");
        const sendListData = JSON.parse(fileData);

        const servers = sendListData["servers"];
        return Object.values(servers);
    } catch (error) {
        console.log("Error reading the file:", error);
        return [];
    }
}

function saveServers(gID, cID, roleID) {
    let fileData = {};
    try {
        fileData = JSON.parse(fs.readFileSync("../servers.json", 'utf-8'));
    } catch (error) {
        console.log("Error reading the file:", error);
    }

    if (!fileData.servers) {
        fileData.servers = {};
    }

    const existingServerKey = Object.keys(fileData.servers).find(key => fileData.servers[key].guildID === gID);

    if (existingServerKey) {
        fileData.servers[existingServerKey] = {
            guildID: gID,
            channelID: cID,
            roleID: roleID
        };

    } else {
        const nextServerId = Object.keys(fileData.servers).length + 1;

        fileData.servers[nextServerId] = {
            guildID: gID,
            channelID: cID,
            roleID: roleID
        };
    }

    try {
        fs.writeFileSync("../servers.json", JSON.stringify(fileData, null, 2));
        console.log("New data saved to 'servers.json'.");
    } catch (error) {
        console.log("Error writing the file:", error);
    }
}

module.exports = { loadServers, saveServers };