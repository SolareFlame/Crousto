import {addGuild} from "../services/data/guildService.js";

export default {
    name: 'guildCreate',
    once: false,
    async execute(guild, client) {
        console.log(`Guild: Bot ajouté au serveur : ${guild.name} (id: ${guild.id})`);

        let channel = guild.systemChannel;
        if (channel) {
            try {
                await channel.send(`Merci de m'avoir ajouté au serveur **${guild.name}** !`);
            } catch (err) {
                console.error('guildCreate: impossible d’envoyer le message de bienvenue :', err?.message || err);
            }
        }

        try {
            await addGuild(guild.id, client);
        } catch (err) {
            console.error('guildCreate: addGuild error:', err?.message || err);
        }
    }
};
