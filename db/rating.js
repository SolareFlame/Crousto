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

export function findAverageMenuRating(menuId) {
    return prisma.rating.aggregate({
        where: {
            menuId: menuId
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });
}

export function findAverageUserRating(userId) {
    return prisma.rating.aggregate({
        where: {
            userId: userId
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });
}

export function findAverageRestaurantRating(restaurantId) {
    return prisma.rating.aggregate({
        where: {
            menu: {
                restaurantId: restaurantId
            }
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });
}

export async function countRatings() {
    return prisma.rating.count();
}