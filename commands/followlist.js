import { SlashCommandBuilder } from "discord.js";
import {listSubscriptions} from "../services/data/subService.js";
import {renderFollowList} from "../services/message/followlistMessage.js";

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
