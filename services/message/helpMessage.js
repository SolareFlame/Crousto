/** @type {Config} */
import { config } from '../../utils/config_loader.js';
import {EmbedBuilder} from "discord.js";

export async function renderHelp() {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle("Menu d\'aide " + config.data.bot_name)
        .setDescription("Voici la liste des commandes disponibles pour " + config.data.bot_name + " :")
        .addFields(
            {
                name: 'menu',
                value: `Donne le menu du jour pour un restaurant donné et un repas donné ('midi' par défaut).\n Usage: /menu (restaurant) (repas?)\n`,
                inline: false
            },
            {
                name: 'info',
                value: `Affiche les informations sur un restaurant.\n Usage: /info (restaurant)\n`,
                inline: false
            },
            {
                name: 'list',
                value: `Affiche la liste des restaurants.\n Usage: /list\n`,
                inline: false
            })

        .setThumbnail(config.visuals.logos.default)
        .setTimestamp()
        .setFooter({
            text: `${process.env.DISCORD_BOT_NAME} by Solare`,
            iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
        });

    return {
        embeds: [embed]
    };
}


