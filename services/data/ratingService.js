import {
    findAverageMenuRating,
    findAverageRestaurantRating,
    findAverageUserRating,
    findRating,
    upsertRating
} from "../../db/rating.js";

export async function addRating(mId, userId, rating) {
    return upsertRating(mId, userId, rating);
}

export async function getRating(mId, userId) {
    return findRating(mId, userId);
}

export async function getAverageMenuRating(mId) {
    return findAverageMenuRating(mId);
}

export async function getAverageUserRating(userId) {
    return findAverageUserRating(userId);
}

export async function getAverageRestaurantRating(restaurantId) {
    return findAverageRestaurantRating(restaurantId);
}
