const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

/** @type {Config} */
const config = require('../../config/config.json');

async function renderInfo(restaurant) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: process.env.DISCORD_BOT_NAME,
            url: process.env.GITHUB_URL,
            iconURL: process.env.LOGO_1_URL
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle('Information sur ' + restaurant.title)
        .setDescription(restaurant.shortDesc)
        .addFields({
            name: 'Localisation',
            value: `[${restaurant.address}](https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude})`,
            inline: true
        }, {
            name: 'Contact',
            value: `${restaurant.name}\n${restaurant.phone}`,
            inline: true
        }, {
            name: 'EDT',
            value: "```" +
                `Lundi:    ${restaurant.opening[1].label}\n` +
                `Mardi:    ${restaurant.opening[2].label}\n` +
                `Mercredi: ${restaurant.opening[3].label}\n` +
                `Jeudi:    ${restaurant.opening[4].label}\n` +
                `Vendredi: ${restaurant.opening[5].label}\n` +
                `Samedi:   ${restaurant.opening[6].label}\n` +
                `Dimanche: ${restaurant.opening[7].label}` +
                "```",
            inline: false
        })

        .setThumbnail('\n' + restaurant.thumbnailUrl)
        .setTimestamp()
        .setFooter({
            text: `${process.env.DISCORD_BOT_NAME} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });
}

module.exports = { renderInfo };
