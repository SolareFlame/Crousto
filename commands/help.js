const {SlashCommandBuilder} = require('discord.js');

const {renderHelp} = require("../services/message/helpMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche les commandes disponibles'),

    async execute(interaction) {
        const render = await renderHelp();
        await interaction.editReply(render);
    },
};
