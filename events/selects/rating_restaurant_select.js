import {addRestaurantRating} from "../../services/data/restaurantRatingService.js";

export default {
    customId: 'rating_restaurant_select',
    defer: 'update',
    async execute(interaction) {
        const rId = interaction.customId.split(':')[1];
        const userId = interaction.user.id;
        const rating = interaction.values[0];

        await addRestaurantRating(rId, userId, rating);

        return interaction.editReply(
            {
                content: `Note de ${rating} étoile${rating > 1 ? 's' : ''} ajoutée.`,
                ephemeral: true,
                embeds: [],
                components: []
            });
    },
};
