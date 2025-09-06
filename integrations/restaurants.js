/** @type {Config} */
const {config} = require('../utils/config_loader');
const cheerio = require('cheerio');

/**
 * Récupère la liste des restaurants depuis l'API
 * et enrichit chaque entrée avec name, address, phone.
 */
async function fetchRestaurants() {
    const url = `${config.api_univ.url}${config.api_univ.endpoints.restaurants.endpoint}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur API (${res.status}) ${res.statusText}`);

        const data = await res.json();
        console.log('API called: ', url);

        if (!Array.isArray(data)) return [];
        return data;

    } catch (err) {
        console.error('fetchRestaurants error =', err?.message || err);
        return [];
    }
}

module.exports = {fetchRestaurants};
