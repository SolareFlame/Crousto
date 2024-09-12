const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { getData, getMenu, getDate, formatMenu } = require('./menu');
const {loadServers} = require("./servers");

async function sendMenu(cID, interaction) {
    try {

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
        let server = list.find(server => server.guildID === channel.guildId);
        let role;

        if (server && server.roleID) {
            role = "<@&" + server.roleID + ">";
        } else {
            role = "@everyone";
        }

        if(interaction) {
            await interaction.reply({ content: role, embeds: [embed], allowedMentions: { parse: ["everyone"] } });
        } else {
            await channel.send({ content: role, embeds: [embed], allowedMentions: { parse: ["everyone"] } });
        }
        console.log(`Menu send at: ${cID}.`);
    } catch (error) {
        console.error('Error sending menu:', error);
    }
}


async function sendHelp(interaction) {
    try {
        const embed = new EmbedBuilder()
            .setColor(0xFFC832)
            .setTitle('Aide')
            .setDescription('Commandes disponibles:')
            .addFields(
                {
                    name: '/help',
                    value: "Vous donne des informations sur le bots (notament la liste des commandes).",
                    inline: false
                },
                {
                    name: '/setup <#channel> <@role> (optional)',
                    value: "Inscrit le #channel et le @role (optionel) pour le menu quotidien.",
                    inline: false
                },
                {
                    name: '/update',
                    value: "Force la mise à jour du menu (menu.html).",
                    inline: false
                },
                {
                    name: '/menu',
                    value: "Force l'envoi du menu.",
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'CroustoBot by Solare', iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error sending help:', error);
    }
}

module.exports = { sendMenu, sendHelp };
