import {SlashCommandBuilder} from "discord.js";
import {getAllRestaurants} from "../services/data/restaurantService.js";
import {follow, listSubscriptions, unfollow} from "../services/data/subService.js";
import {renderFollow} from "../services/message/followMessage.js";
import {renderUnfollow} from "../services/message/unfollowMessage.js";


export default {
    data: new SlashCommandBuilder()
        .setName('unfollow')
        .setDescription('Se désabonner du menu d\'un restaurant')
        .addStringOption(option =>
            option.setName('abonnement')
                .setDescription('abonnement voulu')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const subs = await listSubscriptions(interaction.guildId);
        const focused = interaction.options.getFocused();

        const trunc = (str, max = 100) => (str.length > max ? str.slice(0, max - 1) + '…' : str);

        const choices = subs.map(s => {
            const channel_name = interaction.client.channels.cache.get(s.channelId).name;


            const label = `${s.restaurant.title} - ${s.mealName} - #${channel_name}`;
            return {
                name: trunc(label, 100),
                value: JSON.stringify({chId: s.channelId, rId: s.restaurantId}),
            };
        })
            .filter(c => c.name.toLowerCase().includes(focused))
            .slice(0, 25);

        await interaction.respond(choices);
    },

    async execute(interaction) {
        const sub_res = JSON.parse(interaction.options.getString('abonnement'));

        const guild_id = interaction.guildId;
        const channel_id = sub_res.chId;
        const restaurant_id = sub_res.rId;

        console.log(`Guild ${guild_id} - Unfollow channel=${channel_id} restaurant=${restaurant_id}`);

        await unfollow(guild_id, channel_id, restaurant_id);

        const render = await renderUnfollow();
        await interaction.editReply(render);
    },
};
