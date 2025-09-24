/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js";
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
        .setDescription(restaurant.shortDesc?.trim() || null)
        .setThumbnail('\n' + restaurant.thumbnailUrl)
        .setTimestamp()
        .setImage(config.visuals.banners.rating_restaurant)
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

    if(restaurant.avg_menu_rating && restaurant.nb_menu_ratings) {
        embed.addFields({
            name: '<:menu_star:' + config.visuals.emojis.menu_star + '> Note moyenne des menus',
            value: `**${restaurant.avg_menu_rating}** étoiles (${restaurant.nb_menu_ratings} avis)`,
            inline: false
        });
    }

    if(restaurant.avg_restaurant_rating && restaurant.nb_restaurant_ratings) {
        embed.addFields({
            name: '<:restaurant_star:' + config.visuals.emojis.restaurant_star + '> Note moyenne du restaurant',
            value: `**${restaurant.avg_restaurant_rating}** étoiles (${restaurant.nb_restaurant_ratings} avis)`,
            inline: false
        });
    }

    const button_rating = new ButtonBuilder()
        .setCustomId('rating_restaurant_button:' + restaurant.id)
        .setLabel('Noter le restaurant')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button_rating)

    return {
        embeds: [embed],
        components: [row]
    }
}
