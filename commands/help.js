import { SlashCommandBuilder } from "discord.js";
import { renderHelp } from "../services/message/helpMessage.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche les commandes disponibles'),

    async execute(interaction) {
        const render = await renderHelp();
        await interaction.editReply(render);
    },
};
