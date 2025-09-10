import {renderInfo} from "../../services/message/infoMessage.js";
import {getRestaurant} from "../../services/data/restaurantService.js";
import {getMenuById} from "../../services/data/menuService.js";
import {renderRate} from "../../services/message/rateMessage.js";

export default {
    customId: 'rate',
    defer: 'reply',
    async execute(interaction) {
        const menu_id = interaction.customId.split(':')[1];
        const menu = await getMenuById(menu_id)

        const render = await renderRate(menu);
        await interaction.editReply(render);
    },
};
