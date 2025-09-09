import {SlashCommandBuilder} from "discord.js";

import {getRestaurant, getAllRestaurants} from "../services/data/restaurantService.js";
import {renderInfo} from "../services/message/infoMessage.js";


export default {
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
        const restaurant = await getRestaurant(restaurant_id)

        const render = await renderInfo(restaurant);
        await interaction.editReply(render);
    },
};
