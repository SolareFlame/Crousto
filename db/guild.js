const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function addGuild(guildId, name) {
    return prisma.guild.create({
        data: {guildId, name},
    });
}

function removeGuild(guildId) {
    return prisma.guild.delete({
        where: {guildId},
    });
}