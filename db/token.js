import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient(/*{ log: ['query','error','warn'] }*/);


// TOKEN OCC TABLE
export async function upsertToken(token, label, menuId) {
    return prisma.tokenOccurrence.upsert({
        where: {token},
        update: {
            token: token,
            label: label,
            menuId: menuId,
        },
        create: {
            token: token,
            label: label,
            menuId: menuId,
        },
    });
}

export async function getTokenById(id) {
    return prisma.tokenOccurrence.findUnique({
        where: {id},
    });
}

export async function getToken(token) {
    return prisma.tokenOccurrence.findUnique({
        where: {token},
    });
}

