import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();


export function upsertRating(menuId, userId, rating) {
    return prisma.rating.upsert({
        where: {
            userId_menuId: { userId, menuId },
        },
        update: {
            rating: Number(rating),
        },
        create: {
            menuId : menuId,
            userId : userId,
            rating: Number(rating),
        }
    });
}


export function findRating(menuId, userId) {
    return prisma.rating.findUnique({
        where: {
            userId_menuId: { userId, menuId },
        }
    });
}

export function findAverageRating(menuId) {
    return prisma.rating.aggregate({
        where: {
            menuId: menuId
        },
        _avg: {
            rate: true
        }
    });
}

