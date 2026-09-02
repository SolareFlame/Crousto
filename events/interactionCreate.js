const {findUserById, upsertUser} = await import('../db/user.js');

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {

        // AUTOCOMPLETE
        // Traité en premier: Discord n'accorde que 3s pour répondre, et il est
        // envoyé à chaque frappe. On évite donc l'upsert user en DB ci-dessous,
        // et on ne tente jamais de reply (impossible sur ce type d'interaction).
        if (interaction.isAutocomplete()) {
            const started = Date.now();
            try {
                const cmd = interaction.client.commands.get(interaction.commandName);
                if (!cmd?.autocomplete) return;

                await cmd.autocomplete(interaction);
            } catch (err) {
                console.error(`Autocomplete: /${interaction.commandName} a échoué après ${Date.now() - started}ms:`, err);
            }
            return;
        }

        // DB USER
        try {
            if (interaction.user) {
                let user = await findUserById(interaction.user.id);
                if (!user) {
                    user = await upsertUser(interaction.user.id, interaction.user.username);
                }
            }
        } catch (err) {
            console.error('Error during user upsert:', err);
        }

        // HANDLE INTERACTION
        try {
            if (interaction.isChatInputCommand()) {
                const cmd = interaction.client.commands.get(interaction.commandName);
                if (!cmd) return;

                await safeDefer(interaction, {ephemeral: false});
                await cmd.execute(interaction);
                return;
            }

            if (interaction.isButton()) {
                let handler = interaction.client.buttons.get(interaction.customId) || interaction.client.buttons.get(interaction.customId.split(':')[0]);
                if (!handler) return;

                try {
                    if (handler.defer === 'update') {
                        await interaction.deferUpdate();
                    } else if (handler.defer === 'reply') {
                        await interaction.deferReply({ephemeral: true});
                    }

                    await handler.execute(interaction);
                } catch (err) {
                    console.error(err);
                    await safeReply(interaction, {content: 'Erreur interaction.', ephemeral: true});
                }
            }

            if (interaction.isAnySelectMenu()) {
                let handler = interaction.client.selects.get(interaction.customId)
                    || interaction.client.selects.get(interaction.customId.split(':')[0]);
                if (!handler) return;

                try {
                    if (handler.defer === 'update') {
                        await interaction.deferUpdate();
                    } else if (handler.defer === 'reply') {
                        await interaction.deferReply({ephemeral: true});
                    }

                    await handler.execute(interaction);
                } catch (err) {
                    console.error(err);
                    await safeReply(interaction, {content: 'Erreur interaction.', ephemeral: true});
                }
            }

        } catch (err) {
            console.error(err);
            await safeReply(interaction, {
                content: "**Crousto n'a pas réussi à exécuter cette demande.**\n Veuillez réessayer plus tard. \nSi le problème persiste, contactez @solaredev.",
                ephemeral: true,
            });
        }
    },
};

/**
 * Safely defers a reply to an interaction if it hasn't been deferred or replied to yet.
 */
async function safeDefer(interaction, options = {ephemeral: true}) {
    if (interaction.deferred || interaction.replied) return;
    if (interaction.isButton?.()) return;

    try {
        await interaction.deferReply(options);
    } catch (err) {
        console.error('Error during deferReply:', err);
    }
}

/**
 * Safely replies or edits a reply to an interaction based on its state.
 */
async function safeReply(interaction, options) {
    try {
        if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(options);
        } else {
            return await interaction.reply(options);
        }
    } catch (err) {
        console.error('Error during safeReply:', err);
    }
}
