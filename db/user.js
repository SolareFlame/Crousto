import prisma from "./client.js";


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

export async function countUsers() {
    return prisma.user.count();
}