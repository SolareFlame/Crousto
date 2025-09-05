const {SlashCommandBuilder} = require('discord.js');

const {filterRestaurants, getRestaurant} = require('../services/data/restaurantService');
const {renderInfo} = require("../services/message/infoMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Affiche les informations sur un restaurant')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du restaurant')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const restaurants = await filterRestaurants();
        const focused = interaction.options.getFocused();

        const choices = restaurants.map(r => ({
            name: r.title,
            value: String(r.id),
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.toLowerCase())
        );

        await interaction.respond(filtered.slice(0, 25));
    },

    async execute(interaction) {
        const restaurant_id = interaction.options.getString('id');
        const restaurant = await getRestaurant(restaurant_id)

        const render = await renderInfo(restaurant);
        await interaction.editReply(render);
    },
};
