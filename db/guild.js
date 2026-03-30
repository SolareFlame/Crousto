import prisma from "./client.js";

export function upsertGuild(guildId, name, ownerId) {
    return prisma.guild.upsert({
        where: {guildId},
        update: {name, ownerId},
        create: {guildId, name, ownerId},
    });
}

export async function removeGuild(guildId) {
    return prisma.guild.delete({
        where: {guildId},
    });
}

export async function getGuild(guildId) {
    return prisma.guild.findUnique({
        where: {guildId},
    });
}

export async function countGuilds() {
    return prisma.guild.count();
}