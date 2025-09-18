import { SlashCommandBuilder } from "discord.js";
import { renderHelp } from "../services/message/helpMessage.js";

import {getTotalGuilds} from "../services/data/guildService.js";
import {getTotalRestaurants} from "../services/data/restaurantService.js";
import {getTotalMenus} from "../services/data/menuService.js";
import {getTotalUsers} from "../services/data/userService.js";
import {getTotalRatings} from "../services/data/ratingService.js";
import {renderStats} from "../services/message/statsMessage.js";

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Stats pour les nerds 🤓'),

    async execute(interaction) {
        const stats = [
            {
                name: "guilds",
                value: await getTotalGuilds(),
            },
            {
                name: "restaurants",
                value: await getTotalRestaurants(),
            },
            {
                name: "menus",
                value: await getTotalMenus(),
            },
            {
                name: "ratings",
                value: await getTotalRatings(),
            },
            {
                name: "users",
                value: await getTotalUsers(),
            },
        ];

        const render = await renderStats(stats);
        await interaction.editReply(render);
    },
};
