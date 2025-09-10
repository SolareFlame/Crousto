import {addRating} from "../../services/data/ratingService.js";

export default {
    customId: 'rating_select',
    defer: 'reply',
    async execute(interaction) {
        const mId = interaction.customId.split(':')[1];
        const userId = interaction.user.id;
        const rating = interaction.values[0];

        await addRating(mId, userId, rating);

        return interaction.editReply(
            {
                content: `note de ${rating} étoile${rating > 1 ? 's' : ''} ajoutée.`,
                ephemeral: true
            });
    },
};
