/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import { EmbedBuilder } from "discord.js";
import { parseHtml } from "../../utils/data_extractor.js";

export async function renderInfo(restaurant) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle('Information sur ' + restaurant.title)
        .setDescription(restaurant.shortDesc)
        .setThumbnail('\n' + restaurant.thumbnailUrl)
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        })

    parseHtml(restaurant.infosHtml).sections.forEach(s => {
        embed.addFields({ name: s.title, value: s.content, inline: true });
    });
    parseHtml(restaurant.contactHtml).sections.forEach(s => {
        embed.addFields({ name: s.title, value: s.content, inline: true });
    });


    embed.addFields({
        name: 'Ouverture',
        value: "```" +
            `Lundi:    ${restaurant.plannings[0].label}\n` +
            `Mardi:    ${restaurant.plannings[1].label}\n` +
            `Mercredi: ${restaurant.plannings[2].label}\n` +
            `Jeudi:    ${restaurant.plannings[3].label}\n` +
            `Vendredi: ${restaurant.plannings[4].label}\n` +
            `Samedi:   ${restaurant.plannings[5].label}\n` +
            `Dimanche: ${restaurant.plannings[6].label}` +
            "```",
        inline: false
    })

    return {
        embeds: [embed]
    }
}
