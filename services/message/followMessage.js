/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import { EmbedBuilder } from "discord.js";

export async function renderFollow(sub) {
    let message = `Ce salon recevra désormais le menu de **${sub.restaurant.title}** (${sub.mealName}) chaque jour à **${sub.cron}h00**.`;
    if(sub.roleId) {
        message += `\nLes membres avec le rôle <@&${sub.roleId}> seront mentionnés à chaque envoi.`;
    }
    message += `\n\nPour supprimer cet abonnement, utilisez la commande \`/unfollow\`.`;


    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle(`Abonnement ajouté à ${sub.restaurant.title} !`)
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        })
    return {
        embeds: [embed]
    }
}
