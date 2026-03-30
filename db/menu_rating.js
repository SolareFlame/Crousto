import prisma from "./client.js";


export function upsertMenuRating(menuId, userId, rating) {
    return prisma.menuRating.upsert({
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


export function findMenuRating(menuId, userId) {
    return prisma.menuRating.findUnique({
        where: {
            userId_menuId: { userId, menuId },
        }
    });
}

export function findAverageMenuRestaurantRating(restaurantId) {
    return prisma.menuRating.aggregate({
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

export async function countMenuRatings() {
    return prisma.menuRating.count();
}