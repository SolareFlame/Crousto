import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export function addGuild(guildId, name) {
    return prisma.guild.create({
        data: {guildId, name},
    });
}

export function removeGuild(guildId) {
    return prisma.guild.delete({
        where: {guildId},
    });
}