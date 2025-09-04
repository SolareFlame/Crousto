/** @type {Config} */
const { config } = require('../utils/config_loader');


/**
 * Appelle l'API Crous UL pour récupérer les infos des restaurants.
 *
 * @returns {Promise<Array>} tableau de restaurants
 * @throws {Error} if restaurant_id is missing or the API returns non-OK
 */
async function fetchRestaurants() {
    const url = `${config.api_univ.url}${config.api_univ.endpoints.restaurants.endpoint}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Erreur API (${res.status}) ${res.statusText}`);
        }
        let data = await res.json();

        if (!Array.isArray(data)) return [];
        return data;
    } catch (err) {
        console.error('menuService: fetch_menus_raw error=', err.message || err);
        return [];
    }
}


module.exports = { fetchRestaurants };