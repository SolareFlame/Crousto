const {SlashCommandBuilder} = require('discord.js');

const {getAllRestaurants} = require('../services/data/restaurantService');
const {renderListe} = require("../services/message/listMessage");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Affiche les restaurants disponibles'),

    async execute(interaction) {
        const restaurants = await getAllRestaurants()

        const render = await renderListe(restaurants);
        await interaction.editReply(render);
    },
};
