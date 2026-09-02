import {SlashCommandBuilder} from "discord.js";

import {getRestaurantById, getAllRestaurants} from "../services/data/restaurantService.js";
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
            value: String(r.id),
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.toLowerCase())
        );

        await interaction.respond(filtered.slice(0, 25));
    },

    async execute(interaction) {
        const restaurant_id = interaction.options.getString('id');
        const restaurant = restaurant_id ? await getRestaurantById(restaurant_id) : null;
        if (!restaurant) {
            await interaction.editReply({
                content: "Restaurant introuvable. Choisis une suggestion dans la liste plutôt que de taper le nom à la main.",
            });
            return;
        }

        const render = await renderInfo(restaurant);
        await interaction.editReply(render);
    },
};
