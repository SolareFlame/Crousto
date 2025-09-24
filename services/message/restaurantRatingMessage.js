import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } from "discord.js";

/** @type {Config} */
import { config } from "../../utils/config_loader.js";

export async function renderRestaurantRating(restaurant, rating = null) {
    const embed = new EmbedBuilder()
        .setColor(parseInt(config.visuals.colors.restaurant_rating) ?? 0xFFF)
        .setTitle("Noter ce restaurant")

    const select = new StringSelectMenuBuilder()
        .setCustomId("rating_restaurant_select:" + restaurant.id)
        .setPlaceholder("Sélectionnez une note...")
        .addOptions(
            ...[1, 2, 3, 4, 5].map(n =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${n} étoile${n > 1 ? "s" : ""}`)
                    .setValue(String(n))
                    .setEmoji({ id: config.visuals.emojis.star, name: "star" })
                    .setDefault(rating?.rating === n)
            )
        );

    if(rating) {
        embed.setDescription(`Tu as déjà noté ce restaurant ${rating.rating} étoile${rating.rating > 1 ? "s" : ""}.`)
    } else {
        embed.setDescription("Sélectionne une note dans le menu déroulant ci-dessous.")
    }

    const row = new ActionRowBuilder().addComponents(select);

    return {
        embeds: [embed],
        components: [row]
    };
}
