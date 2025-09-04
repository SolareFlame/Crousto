const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

async function renderMenu(restaurant, menu) {

    console.log("RESTAURANT: " + restaurant);
    console.log("MENU: " + menu);

    const embedRestaurant = new EmbedBuilder()
        .setAuthor({
            name: process.env.DISCORD_BOT_NAME,
            url: process.env.GITHUB_URL,
            iconURL: process.env.LOGO_1_URL
        })
        .setColor(0xFAAF18)
        .setTitle(restaurant.title)
        .setDescription(restaurant.shortDesc + '\n' + '[Location](https://www.google.com/maps/search/?api=1&query=' + restaurant.latitude + ',' + restaurant.longitude + ')')
        .setThumbnail(restaurant.thumbnailUrl);

    const embedMenu = new EmbedBuilder()
        .setColor(0xFAAF18)
        .setTitle('Menu du ' + date)
        .setDescription(menu)
        .setTimestamp()
        .setFooter({
            text: `${process.env.DISCORD_BOT_NAME} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });

    const button = new ButtonBuilder()
        .setCustomId('info_' + id)
        .setLabel('Plus d\'infos')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button);

    return {
        embeds: [embedRestaurant, embedMenu],
        components: [row]
    }
}

module.exports = {renderMenu};
