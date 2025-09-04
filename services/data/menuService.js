const { fetchMenu } = require('../../integrations/menus');

/**
 * @typedef {Object} MenuFood
 * @property {string} name
 * @property {string[]} dishes
 */

/**
 * @typedef {Object} MenuMeal
 * @property {string} name
 * @property {MenuFood[]} foodcategory
 */

/**
 * @typedef {Object} Menu
 * @property {number} id
 * @property {string} date
 * @property {MenuMeal[]} meal
 */


/**
 * Retourne le menu d'un restaurant pour une date ISO (YYYY-MM-DD).
 *
 * @param {string|number} restaurant_id
 * @param date
 * @returns {Promise<Menu|null>}
 */
async function getMenu(restaurant_id, date = getTodayDate()){
    if (!date) throw new Error('date format ISO requis (YYYY-MM-DD)');

    const rows = await fetchMenu(restaurant_id);
    const found = rows.find(r => r.date === date);
    return found || null;
}


/**
 * Retourne un "repas" (midi || soir) pour une date donnée.
 *
 * @param {string|number} restaurant_id
 * @param {string} date
 * @param {string} meal_name
 * @returns {Promise<Meal|null>}
 */
async function getMeal(restaurant_id, date, meal_name) {
    /**
     * @typedef {Object} Menu
     * @property {string} date
     * @property {number} id
     * @property {Meal[]} meal
     *
     * @typedef {Object} Meal
     * @property {string} name
     * @property {string[]} foodcategory
     */

    /** @type {Menu} */
    const menu = await getMenu(restaurant_id, date);
    if (!menu || !Array.isArray(menu.meal)) return null;

    const wanted = meal_name.trim().toLowerCase();
    const found = menu.meal.find(m => m.name.trim().toLowerCase() === wanted);

    return found || null;
}


/**
 * Retourne la date d’aujourd’hui au format ISO (YYYY-MM-DD).
 */
function getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');

    return `${y}-${m}-${day}`;
}


/**
 * Retourne une date formatée en français.
 */
function renderDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const d = new Date(date);

    return d.toLocaleDateString('fr-FR', options);
}