/** @type {Config} */
import {config} from "../utils/config_loader.js";


/**
 * Appelle l'API Crous UL pour un restaurant.
 *
 * IMPORTANT: ne JAMAIS passer de "date" (API buggée).
 * @param {string|number} restaurant_id
 * @returns {Promise<Array>} tableau de menus (jours), ou [] si rien
 * @throws {Error} if restaurant_id is missing or the API returns non-OK
 */
export async function fetchMenu(restaurant_id) {
    if (!restaurant_id) {
        throw new Error('restaurant_id needed.');
    }

    const url = `${config.api_univ.url}${config.api_univ.endpoints.menus.endpoint}?id=${encodeURIComponent(restaurant_id)}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Erreur API (${res.status}) ${res.statusText}`);
        }
        let data = await res.json();

        console.log('API called: ', url);

        if (!Array.isArray(data)) return [];
        return data;
    } catch (err) {
        console.error('menuService: fetch_menus_raw error=', err.message || err);
        return [];
    }
}