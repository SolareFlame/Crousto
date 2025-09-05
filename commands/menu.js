const {SlashCommandBuilder} = require('discord.js');

const {filterRestaurants, getRestaurant} = require('../services/data/restaurantService');
const {getMenu} = require('../services/data/menuService');

const {renderMenu} = require('../services/message/menuMessage');

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
                .setRequired(true)
                .addChoices(
                    {name: 'midi', value: 'midi'},
                    {name: 'soir', value: 'soir'}
                )
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
        const meal_name = interaction.options.getString('repas');

        const menu = await getMenu(restaurant_id, meal_name);
        const restaurant = await getRestaurant(restaurant_id)

        const render = await renderMenu(restaurant, menu);
        await interaction.editReply(render);
    },
};
