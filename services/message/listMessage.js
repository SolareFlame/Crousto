const { EmbedBuilder } = require('discord.js');

/** @type {Config} */
const config = require('../../config/config.json');

/**
 * Rend une liste de restaurants dans un embed Discord.
 * @param {Array<{ title: string, shortDesc?: string }>} restaurants
 * @returns {Promise<{embeds: EmbedBuilder[]}>}
 */
async function renderList(restaurants) {

    const description = restaurants.length > 0
        ?
        restaurants.map(r => {
            return '- **' + r.title + '**' + (r.shortDesc ? `: ${r.shortDesc}` : '');
        }).join('\n')
        :
        '_Aucun restaurant trouvé._';


    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle('Liste des restaurants')
        .setDescription(description)
        .setThumbnail(config.visuals.logos.default)
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });

    return {
        embeds: [embed],
    };
}

module.exports = { renderListe: renderList };
