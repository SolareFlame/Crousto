import {
    countRestaurantRatings,
    findAverageRestaurantRating,
    findRestaurantRating,
    upsertRestaurantRating

} from "../../db/restaurant_rating.js";

export async function addRestaurantRating(rId, userId, rating) {
    return upsertRestaurantRating(rId, userId, rating);
}

export async function getRestaurantRating(rId, userId) {
    return findRestaurantRating(rId, userId);
}

export async function getAverageRestaurantRating(restaurantId) {
    return findAverageRestaurantRating(restaurantId);
}

export async function getTotalRestaurantRatings() {
    return countRestaurantRatings()
}
