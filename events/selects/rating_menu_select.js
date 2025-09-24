import {addMenuRating} from "../../services/data/menuRatingService.js";

export default {
    customId: 'rating_menu_select',
    defer: 'update',
    async execute(interaction) {
        const mId = interaction.customId.split(':')[1];
        const userId = interaction.user.id;
        const rating = interaction.values[0];

        await addMenuRating(mId, userId, rating);

        return interaction.editReply(
            {
                content: `Note de ${rating} étoile${rating > 1 ? 's' : ''} ajoutée.`,
                ephemeral: true,
                embeds: [],
                components: []
            });
    },
};
