/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import {EmbedBuilder} from "discord.js";

export async function renderStats(stats) {
    const banner_embed = new EmbedBuilder()
        .setImage(config.visuals.banners.default)
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle("Actually, voici les stats de " + config.data.bot_name + " ☝️🤓")
        .setThumbnail(config.visuals.logos.default)
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });

    stats.forEach(stat => {
        embed.addFields({ name: stat.name, value: String(stat.value), inline: false });
    });

    return {
        embeds: [banner_embed, embed],
    };
}


