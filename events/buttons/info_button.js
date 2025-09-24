import {renderInfo} from "../../services/message/infoMessage.js";
import {getRestaurantById} from "../../services/data/restaurantService.js";

export default {
    customId: 'info_button',
    defer: 'reply',
    async execute(interaction) {
        const restaurant_id = interaction.customId.split(':')[1];
        const restaurant = await getRestaurantById(restaurant_id)

        const render = await renderInfo(restaurant);
        await interaction.editReply(render);
    },
};
