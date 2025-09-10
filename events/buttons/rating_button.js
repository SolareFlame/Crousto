import {getMenuById} from "../../services/data/menuService.js";
import {renderRating} from "../../services/message/ratingMessage.js";
import {getRating} from "../../services/data/ratingService.js";

export default {
    customId: 'rating_button',
    defer: 'reply',
    async execute(interaction) {
        const menu_id = interaction.customId.split(':')[1];
        const menu = await getMenuById(menu_id)

        const old_rating = await getRating(menu_id, interaction.user.id) ?? null;

        const render = await renderRating(menu, old_rating);
        await interaction.editReply(render);
    },
};
