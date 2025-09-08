const {renderInfo} = require("../../services/message/infoMessage");
const {getRestaurant} = require("../../services/data/restaurantService");
module.exports = {
    customId: 'info',
    defer: 'reply',
    async execute(interaction) {
        const restaurant_id = interaction.customId.split(':')[1];
        const restaurant = await getRestaurant(restaurant_id)

        const render = await renderInfo(restaurant);
        await interaction.editReply(render);
    },
};
