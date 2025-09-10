import {addRating} from "../../services/data/rateService.js";

export default {
    customId: 'rating_select',
    defer: 'reply',
    async execute(interaction) {
        const mId = interaction.customId.split(':')[1];
        const userId = interaction.user.id;
        const rate = interaction.values[0];

        await addRating(mId, userId, rate);
        return {content: `note de ${rate} étoile${rate > 1 ? 's' : ''} ajoutée.`, ephemeral: true};
    },
};
