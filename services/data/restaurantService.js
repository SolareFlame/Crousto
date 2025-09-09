import {findAllRestaurants, findRestaurantById, setRestaurant} from "../../db/restaurant.js";
import {fetchRestaurants} from "../../integrations/restaurants.js";

/**
 * Retourne un restaurant par son ID.
 *
 * @param {number|string} rId
 * @returns {Promise<RestaurantDB|null>}
 */
export async function getRestaurant(rId) {
    let restaurant = await findRestaurantById(rId)

    // INSERT DB
    if(restaurant === null) {
        const list = await fetchRestaurants();
        const restaurant_raw = list.find(r => r.id === rId) ?? null;

        try {
            if(restaurant_raw) await setRestaurant(restaurant_raw)
        } catch (error) {
            console.error('Error saving restaurant to DB:', error);
        }

        restaurant = await findRestaurantBySourceId(rId);
    }

    if(!restaurant) return null;
    return restaurant
}

export async function getAllRestaurants() {
    return await findAllRestaurants();
}


export async function updateRestaurants(_logs = false) {
    const items = await fetchRestaurants();
    for (const item of items) {
        try {
            await setRestaurant(item, _logs);
            if(_logs) console.log(`Upserted restaurant: ${item.title}`);
        } catch (error) {
            console.error(`Error upserting restaurant ${item.title}:`, error);
        }
    }
}
