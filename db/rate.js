import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();


export function upsertRate(mId, userId, rate) {
    return prisma.rate.upsert({
        where: {
            mId_userId: {
                mId: mId,
                userId: userId
            }
        },
        update: {
            rate: rate
        },
        create: {
            mId: mId,
            userId: userId,
            rate: rate
        }
    });
}

export function findRate(mId, userId) {
    return prisma.rate.findUnique({
        where: {
            mId_userId: {
                mId: mId,
                userId: userId
            }
        }
    });
}

export function findAverageRate(mId) {
    return prisma.rate.aggregate({
        where: {
            mId: mId
        },
        _avg: {
            rate: true
        }
    });
}

