import {upsertGuild} from "../../db/guild.js";


export async function addGuild(guildId, client) {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
        console.error(`GuildService: Guild with ID ${guildId} not found.`);
        return;
    }

    const name = guild.name;
    const ownerId = guild.ownerId;

    try {
        await upsertGuild(guildId, name, ownerId);
    } catch (error) {
        console.error(`GuildService: Error adding/updating guild ${name} (${guildId}):`, error);
    }
}

