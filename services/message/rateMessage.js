import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } from "discord.js";

/** @type {Config} */
import { config } from "../../utils/config_loader.js";

export async function renderRate(follow_list) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: config.data.bot_name,
            url: config.data.github_url,
            iconURL: config.visuals.logos.default,
        })
        .setColor(parseInt(config.visuals.colors.primary) ?? 0xFFF)
        .setTitle("Evaluer le repas")

    const select = new StringSelectMenuBuilder()
        .setCustomId("rate:meal")
        .setPlaceholder("Selectionne ta note")
        .addOptions(
            ...[1, 2, 3, 4, 5].map(n =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${n} étoile${n > 1 ? "s" : ""}`)
                    .setValue(String(n))
                    .setEmoji("⭐")
            )
        );

    const row = new ActionRowBuilder().addComponents(select);

    return {
        embeds: [embed],
        components: [row]
    };
}
