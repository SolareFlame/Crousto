/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import { EmbedBuilder } from "discord.js";

export async function renderUnfollow() {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle(`Abonnement retiré !`)
        .setDescription("Vous ne recevrez plus les menus dans ce salon.\n\nPour ajouter un abonnement, utilisez la commande `/follow`.")
        .setTimestamp()
        .setFooter({
            text: `${config.data.bot_name} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        })
    return {
        embeds: [embed]
    }
}
