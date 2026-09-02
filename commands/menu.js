import {SlashCommandBuilder} from "discord.js";
import {getAllRestaurants, getRestaurantById} from "../services/data/restaurantService.js";
import {getMenu} from "../services/data/menuService.js";
import {renderMenu} from "../services/message/menuMessage.js";


export default {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Affiche le menu du jour')
        .addStringOption(option =>
            option.setName('restaurant')
                .setDescription('Crous voulu')
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
            value: String(r.id),
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.toLowerCase())
        );

        await interaction.respond(filtered.slice(0, 25));
    },

    async execute(interaction) {
        const restaurant_id = interaction.options.getString('restaurant');
        const meal_name = interaction.options.getString('repas') ?? 'midi';

        const restaurant = restaurant_id ? await getRestaurantById(restaurant_id) : null;
        if (!restaurant) {
            await interaction.editReply({
                content: "Restaurant introuvable. Choisis une suggestion dans la liste plutôt que de taper le nom à la main.",
            });
            return;
        }

        const menu = await getMenu(restaurant_id, meal_name);

        const render = await renderMenu(restaurant, menu);
        await interaction.editReply(render);
    },
};
