import prisma from "./client.js";


export function upsertRestaurantRating(restaurantId, userId, rating) {
    return prisma.restaurantRating.upsert({
        where: {
            userId_restaurantId: { userId, restaurantId },
        },
        update: {
            rating: Number(rating),
        },
        create: {
            restaurantId : restaurantId,
            userId : userId,
            rating: Number(rating),
        }
    });
}


export function findRestaurantRating(restaurantId, userId) {
    return prisma.restaurantRating.findUnique({
        where: {
            userId_restaurantId: { userId, restaurantId },
        }
    });
}

export function findAverageRestaurantRating(restaurantId) {
    return prisma.restaurantRating.aggregate({
        where: {
            restaurantId: restaurantId
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });
}

export async function countRestaurantRatings() {
    return prisma.restaurantRating.count();
}