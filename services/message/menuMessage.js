/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js";
import {renderDate} from "../../utils/date_loader.js";
import {formatMenu} from "../data/menuService.js";


/**
 * Génère un message Discord avec le menu du jour d'un restaurant.
 *
 * @param restaurant
 * @param menu
 * @returns {Promise<{embeds: EmbedBuilder[], components: ActionRowBuilder[]}>}
 */
export async function renderMenu(restaurant, menu = null) {
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
        .setImage(config.visuals.banners.rating)
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });


    const button_info = new ButtonBuilder()
        .setCustomId('info_button:' + restaurant.id)
        .setLabel('Plus d\'infos')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button_info)

    if(menu) {
        const button_rating = new ButtonBuilder()
            .setCustomId('rating_button:' + menu.id)
            .setLabel('Noter le menu')
            .setStyle(ButtonStyle.Success);

        row.addComponents(button_rating);
    }

    return {
        embeds: [embedRestaurant, embedMenu],
        components: [row]
    }
}