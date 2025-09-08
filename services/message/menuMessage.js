/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js";


/**
 * Génère un message Discord avec le menu du jour d'un restaurant.
 *
 * @param restaurant
 * @param menu
 * @returns {Promise<{embeds: EmbedBuilder[], components: ActionRowBuilder[]}>}
 */
export async function renderMenu(restaurant, menu) {
    const embedRestaurant = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle(restaurant.title)
        .setDescription(restaurant.shortDesc + '\n' + '[Location](https://www.google.com/maps/search/?api=1&query=' + restaurant.latitude + ',' + restaurant.longitude + ')')
        .setThumbnail(restaurant.thumbnailUrl);

    const embedMenu = new EmbedBuilder()
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle('Menu du ' + renderDate(menu?.date ?? renderDate(new Date())))
        .setDescription(formatMenu(menu))
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });

    const button = new ButtonBuilder()
        .setCustomId('info:' + restaurant.sourceId)
        .setLabel('Plus d\'infos')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button);

    return {
        embeds: [embedRestaurant, embedMenu],
        components: [row]
    }
}