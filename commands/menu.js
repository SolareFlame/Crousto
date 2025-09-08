const {SlashCommandBuilder} = require('discord.js');

const {getRestaurant} = require('../services/data/restaurantService');
const {getMenu} = require('../services/data/menuService');

const {renderMenu} = require('../services/message/menuMessage');
const {getAllRestaurants} = require("../services/data/restaurantService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Affiche le menu du jour')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du restaurant')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('repas')
                .setDescription('Repas du jour')
                .setRequired(false)
                .addChoices(
                    {name: 'midi', value: 'midi'},
                    {name: 'soir', value: 'soir'}
                )
        ),

    async autocomplete(interaction) {
        const restaurants = await getAllRestaurants();
        const focused = interaction.options.getFocused();

        const choices = restaurants.map(r => ({
            name: r.title,
            value: String(r.sourceId),
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.toLowerCase())
        );

        await interaction.respond(filtered.slice(0, 25));
    },

    async execute(interaction) {
        const restaurant_id = interaction.options.getString('id');
        const meal_name = interaction.options.getString('repas') ?? 'midi';

        const menu = await getMenu(restaurant_id, meal_name);
        const restaurant = await getRestaurant(restaurant_id)

        const render = await renderMenu(restaurant, menu);
        await interaction.editReply(render);
    },
};
