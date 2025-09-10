import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export function upsertRating(menuId, userId, rating) {
    return prisma.rate.upsert({
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


export function findRating(mId, userId) {
    return prisma.rate.findUnique({
        where: {
            mId_userId: {
                mId: mId,
                userId: userId
            }
        }
    });
}

export function findAverageRating(mId) {
    return prisma.rate.aggregate({
        where: {
            mId: mId
        },
        _avg: {
            rate: true
        }
    });
}

