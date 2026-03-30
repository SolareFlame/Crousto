import { SlashCommandBuilder } from "discord.js";
import { getAllRestaurants } from "../services/data/restaurantService.js";
import {follow} from "../services/data/subService.js";
import {renderFollow} from "../services/message/followMessage.js";

const heures = [];
for (let h = 6; h <= 22; h++) {
    heures.push({ name: `${h}h`, value: `${h}`});
}

export default {
    data: new SlashCommandBuilder()
        .setName('follow')
        .setDescription('Suivre le menu d\'un restaurant')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du restaurant')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('heure')
                .setDescription('Heure de la notification')
                .setRequired(true)
                .addChoices(...heures)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à mentionner lors de la notification')
                .setRequired(false)
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
        const heure = interaction.options.getString('heure');
        const role = interaction.options.getRole('role')?.id || null;

        const channel_id = interaction.channelId;
        const guild_id = interaction.guildId;

        let subscription = await follow(guild_id, channel_id, restaurant_id, heure, role);

        const render = await renderFollow(subscription);
        await interaction.editReply(render);
    },
};
