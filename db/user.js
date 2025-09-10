import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();


export function findUserById(id) {
    return prisma.user.findUnique({
        where: { userId: id }
    });
}

export function upsertUser(id, name) {
    return prisma.user.upsert({
        where: { userId: id },
        update: {
            name: name,
        },
        create: {
            userId: id,
            name: name,
        }
    });
}