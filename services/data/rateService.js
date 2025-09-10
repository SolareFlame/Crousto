import {findAverageRating, findRating, upsertRating} from "../../db/rating.js";


export async function addRating(mId, userId, rating) {
    return upsertRating(mId, userId, rating);
}

export async function getRating(mId, userId) {
    return findRating(mId, userId);
}

export async function getAverageRating(mId) {
    return findAverageRating(mId);
}