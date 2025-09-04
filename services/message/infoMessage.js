const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

async function renderInfo(restaurant) {

    // Move to restaurantService
    const $ = require('cheerio').load(restaurant.contact);

    const name = $('h2').text();
    const address = $('p').text().split('Tél')[0].trim();

    const phoneMatch = $('p').text().match(/Tél.*?:\s*(.*)/);
    const phone = phoneMatch ? phoneMatch[1].trim() : 'Non trouvé';


    const embed = new EmbedBuilder()
        .setAuthor({
            name: process.env.DISCORD_BOT_NAME,
            url: process.env.GITHUB_URL,
            iconURL: process.env.LOGO_1_URL
        })
        .setColor(0xE30613)
        .setTitle('Information sur ' + restaurant.title)
        .setDescription(restaurant.shortDesc)
        .addFields({
            name: 'Localisation',
            value: `[${address}](https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude})`,
            inline: true
        }, {
            name: 'Contact',
            value: `${name}\n${phone}`,
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
