import {findAverageRate, findRate, upsertRate} from "../../db/rate.js";


export async function rate(mId, userId, rate) {
    await upsertRate(mId, userId, rate);
}

export async function getRate(mId, userId) {
    return await findRate(mId, userId);
}

export async function getAverageRate(mId) {
    return await findAverageRate(mId);
}