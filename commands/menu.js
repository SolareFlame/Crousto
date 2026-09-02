import {SlashCommandBuilder} from "discord.js";
import {getAllRestaurants, getRestaurantById} from "../services/data/restaurantService.js";
import {getAPIMenus, getMenu} from "../services/data/menuService.js";
import {renderMenu} from "../services/message/menuMessage.js";
import {getTodayDate, renderDate} from "../utils/date_loader.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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
        )
        .addStringOption(option =>
            option.setName('jour')
                .setDescription('Jour voulu (par défaut aujourd\'hui)')
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);

        if (focused.name === 'jour') {
            const restaurant_id = interaction.options.getString('restaurant');
            if (!restaurant_id) {
                await interaction.respond([]);
                return;
            }

            let menus = [];
            try {
                menus = await getAPIMenus(restaurant_id) ?? [];
            } catch (error) {
                console.error('menu autocomplete: erreur récupération des jours:', error);
            }

            const choices = menus
                .map(m => m?.date)
                .filter(date => ISO_DATE.test(String(date ?? '')))
                .filter((date, i, all) => all.indexOf(date) === i)
                .sort()
                .map(date => ({name: renderDate(date), value: date}));

            const filtered = choices.filter(choice =>
                choice.name.toLowerCase().includes(focused.value.toLowerCase())
                || choice.value.includes(focused.value)
            );

            await interaction.respond(filtered.slice(0, 25));
            return;
        }

        let restaurants = [];
        try {
            restaurants = await getAllRestaurants() ?? [];
        } catch (error) {
            console.error('menu autocomplete: erreur récupération des restaurants:', error);
        }

        const choices = restaurants.map(r => ({
            name: r.title,
            value: String(r.id),
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.value.toLowerCase())
        );

        await interaction.respond(filtered.slice(0, 25));
    },

    async execute(interaction) {
        const restaurant_id = interaction.options.getString('restaurant');
        const meal_name = interaction.options.getString('repas') ?? 'midi';
        const date = interaction.options.getString('jour') ?? getTodayDate();

        if (!ISO_DATE.test(date)) {
            await interaction.editReply({
                content: "Jour invalide. Choisis une suggestion dans la liste plutôt que de taper la date à la main.",
            });
            return;
        }

        const restaurant = restaurant_id ? await getRestaurantById(restaurant_id) : null;
        if (!restaurant) {
            await interaction.editReply({
                content: "Restaurant introuvable. Choisis une suggestion dans la liste plutôt que de taper le nom à la main.",
            });
            return;
        }

        const menu = await getMenu(restaurant_id, meal_name, date);

        const render = await renderMenu(restaurant, menu, date);
        await interaction.editReply(render);
    },
};
