const { fetchRestaurants } = require('../../integrations/restaurants');
const cheerio = require('cheerio');

/**
 * @typedef {Object} Restaurant
 * @property {number} id
 * @property {string} title
 * @property {Object.<string, OpeningInfo>} opening
 * @property {string} contact
 * @property {string} infos
 * @property {string} zone
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} thumbnailUrl
 * @property {string} shortDesc.
 *
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 */

/**
 * @typedef {Object} OpeningInfo
 * @property {string} label
 * @property {boolean} isOpen
 */


/**
 * Retourne un restaurant par son ID.
 *
 * @param {number|string} id
 * @returns {Promise<Restaurant|null>}
 */
async function getRestaurant(id) {
    const list = await filterRestaurants();
    let restaurant = list.find(r => r.id === parseInt(id)) ?? null;

    if(!restaurant) return null;

    const $ = cheerio.load(restaurant.contact);
    const name = $('h2').first().text();

    const paragraph = $('p').first().text();
    const address = paragraph.split('Tél')[0].trim();

    const phoneMatch = paragraph.match(/Tél\s*:?\s*([0-9 .]+)/);
    const phone = phoneMatch ? phoneMatch[1].trim() : 'Non trouvé';

    return {
        ...restaurant,
        name,
        address,
        phone
    };
}
/**
 * Supprime des restaurants considérés comme non pertinents.
 * Discord limite le nombre de choix dans une datalist à 25.
 *
 * @returns {Promise<Restaurant[]>}
 */
async function filterRestaurants() {
    const restaurants = await fetchRestaurants();

    let filtered = restaurants.filter(r =>
        !r.title.includes("Cafet") &&
        !r.title.includes("Truck") &&
        !r.title.includes("Market") &&
        !r.title.includes("Facteria")
    );

    if (filtered.length > 25) {
        console.warn("WARNING: More than 25 restaurants found. Limiting to 25.");
        filtered = filtered.slice(0, 25);
    }

    return filtered;
}

module.exports = { filterRestaurants, getRestaurant };