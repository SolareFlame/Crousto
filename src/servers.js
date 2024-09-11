const fs = require('fs');

function loadServers() {
    try {
        const fileData = fs.readFileSync("../servers.json", "utf-8");
        const sendListData = JSON.parse(fileData);

        console.log(fileData);

        const servers = sendListData["servers"];
        return Object.values(servers);
    } catch (error) {
        console.log("Erreur lors de la lecture de 'servers.json', fichier introuvable ou invalide.");
        return [];
    }
}

function saveServers(gID, cID, roleID) {
    let fileData = {};
    try {
        fileData = JSON.parse(fs.readFileSync("../servers.json", 'utf-8'));
    } catch (error) {
        console.log("Erreur lors de la lecture du fichier 'servers.json'.");
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

    console.log(fileData);

    try {
        fs.writeFileSync("../servers.json", JSON.stringify(fileData, null, 2));
        console.log("Données mises à jour avec succès !");
    } catch (error) {
        console.log("Erreur lors de la sauvegarde du fichier 'servers.json'.", error);
    }
}

module.exports = { loadServers, saveServers };