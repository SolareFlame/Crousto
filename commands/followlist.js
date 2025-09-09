import { SlashCommandBuilder } from "discord.js";
import {listSubscriptions} from "../services/data/subService.js";
import {renderFollowList} from "../services/message/followlistMessage.js";

const heures = [];
for (let h = 6; h <= 22; h++) {
    heures.push({ name: `${h}h`, value: `${h}`});
}

export default {
    data: new SlashCommandBuilder()
        .setName('followlist')
        .setDescription('Liste des restaurants suivis dans ce serveur'),

    async execute(interaction) {
        const guild_id = interaction.guildId;

        const list = await listSubscriptions(guild_id);

        const render = await renderFollowList(list);
        await interaction.editReply(render);
    },
};
