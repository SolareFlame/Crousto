import {getRestaurantById} from "../../services/data/restaurantService.js";
import {getRestaurantRating} from "../../services/data/restaurantRatingService.js";
import {renderRestaurantRating} from "../../services/message/restaurantRatingMessage.js";

export default {
    customId: 'rating_restaurant_button',
    defer: 'reply',
    async execute(interaction) {
        const rId = interaction.customId.split(':')[1];
        const restaurant = await getRestaurantById(rId);

        const old_rating = await getRestaurantRating(rId, interaction.user.id) ?? null;

        const render = await renderRestaurantRating(restaurant, old_rating);
        await interaction.editReply(render);
    },
};
