const {findRestaurantBySourceId, setRestaurant, findAllRestaurants} = require("../../db/restaurant");
const { fetchRestaurants } = require('../../integrations/restaurants');

/**
 * Retourne un restaurant par son ID.
 *
 * @param {number|string} sourceId
 * @returns {Promise<RestaurantDB|null>}
 */
async function getRestaurant(sourceId) {
    let restaurant = await findRestaurantBySourceId(sourceId)

    // INSERT DB
    if(restaurant === null) {
        const list = await fetchRestaurants();
        const restaurant_raw = list.find(r => r.id === parseInt(sourceId)) ?? null;

        try {
            if(restaurant_raw) await setRestaurant(restaurant_raw).then(r => console.log('Restaurant saved to DB:', r.title));
        } catch (error) {
            console.error('Error saving restaurant to DB:', error);
        }

        restaurant = await findRestaurantBySourceId(sourceId);
    }

    if(!restaurant) return null;
    return restaurant
}

/**
 * Retourne tous les restaurants.
 *
 * @returns {Promise<RestaurantDB[]>}
 */

async function getAllRestaurants() {
    return await findAllRestaurants();
}


async function updateRestaurants() {
    const items = await fetchRestaurants();
    for (const item of items) {
        try {
            await setRestaurant(item);
            console.log(`Upserted restaurant: ${item.title}`);
        } catch (error) {
            console.error(`Error upserting restaurant ${item.title}:`, error);
        }
    }
}

module.exports = { getAllRestaurants, updateRestaurants, getRestaurant };