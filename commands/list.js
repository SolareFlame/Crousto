import {SlashCommandBuilder} from "discord.js";
import {getAllRestaurants} from "../services/data/restaurantService.js";
import {renderListe} from "../services/message/listMessage.js";


export default {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Affiche les restaurants disponibles'),

    async execute(interaction) {
        const restaurants = await getAllRestaurants()

        const render = await renderListe(restaurants);
        await interaction.editReply(render);
    },
};
