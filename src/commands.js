const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { getData, getMenu, getDate, formatMenu } = require('./menu');
const {loadServers} = require("./servers");

async function sendMenu(cID, interaction) {
    try {
        console.log("Nom du channel:", cID);

        const client = require('./bot.js');
        const channel = await client.channels.fetch(cID);


        const data = getData(fs.readFileSync('../menu.html', 'utf-8'));
        const menu = getMenu(data.menu);
        const date = getDate(data);
        const menuFormatted = formatMenu(menu);


        const embed = new EmbedBuilder()
            .setColor(0xFFC832)
            .setTitle('Menu du Jour !')
            .setURL("https://www.crous-lorraine.fr/restaurant/resto-u-medreville-2/")
            .setDescription(`Menu du **${date}**.\nBon appétit !`)
            .addFields({
                name: "Menu:",
                value: menuFormatted,
                inline: false
            })
            .setThumbnail('https://imgur.com/OA7alpw.png')
            .setTimestamp()
            .setFooter({ text: 'CroustoBot by Solare', iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4' });

        let list = loadServers();
        let roleID = list.find(server => server.channelID === cID).roleID;

        let role;
        if(roleID) role = "<@&" + roleID + ">";
        else role = '@everyone';



        if(interaction) {
            await interaction.reply({ content: role, embeds: [embed], allowedMentions: { parse: ["everyone"] } });
        } else {
            await channel.send({ content: role, embeds: [embed], allowedMentions: { parse: ["everyone"] } });
        }
        console.log(`Menu envoyé dans le canal avec l'ID ${cID}.`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du menu :', error);
    }
}

module.exports = { sendMenu };
