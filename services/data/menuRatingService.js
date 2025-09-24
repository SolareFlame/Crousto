import {
    countMenuRatings,
    findAverageMenuRestaurantRating,
    findMenuRating,
    upsertMenuRating
} from "../../db/menu_rating.js";

export async function addMenuRating(mId, userId, rating) {
    return upsertMenuRating(mId, userId, rating);
}

export async function getMenuRating(mId, userId) {
    return findMenuRating(mId, userId);
}


export async function getAverageMenuRestaurantRating(restaurantId) {
    return findAverageMenuRestaurantRating(restaurantId);
}

export async function getTotalMenuRatings() {
    return countMenuRatings()
}
