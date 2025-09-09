/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import { EmbedBuilder } from "discord.js";

export async function renderFollowList(follow_list) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle('Liste des restaurants suivis')
        .setDescription(follow_list.map (f => `<#${f.channelId}> <@&${f.roleId}> : ${f.restaurant.title} (${f.mealName}) - ${f.cron}h`).join('\n') || 'Aucun restaurant suivi.')
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        })
    return {
        embeds: [embed]
    }
}
