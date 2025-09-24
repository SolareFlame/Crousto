import {getMenuById} from "../../services/data/menuService.js";
import {renderMenuRating} from "../../services/message/menuRatingMessage.js";
import {getMenuRating} from "../../services/data/menuRatingService.js";

export default {
    customId: 'rating_menu_button',
    defer: 'reply',
    async execute(interaction) {
        const menu_id = interaction.customId.split(':')[1];
        const menu = await getMenuById(menu_id)

        const old_rating = await getMenuRating(menu_id, interaction.user.id) ?? null;

        const render = await renderMenuRating(menu, old_rating);
        await interaction.editReply(render);
    },
};
