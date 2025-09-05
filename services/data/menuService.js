const { fetchMenu } = require('../../integrations/menus');
const { getTodayDate } = require('../../utils/date_loader');

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
async function getMenuDay(restaurant_id, date = getTodayDate()){
    if (!date) throw new Error('date format ISO requis (YYYY-MM-DD)');

    const rows = await fetchMenu(restaurant_id);
    const found = rows.find(r => r.date === date);

    return found || null;
}


/**
 * Retourne le menu avec le contenu du repas directement spécifié dans "menu.meal".
 *
 * @param restaurant_id
 * @param {string} meal_name
 * @param date
 * @returns {Promise<Meal|null>}
 */
async function getMenu(restaurant_id, meal_name, date = getTodayDate()) {
    /**
     * @typedef {Object} Menu
     * @property {string} date
     * @property {number} id
     * @property {Meal[]} meal
     *
     * @typedef {Object} Meal
     * @property {string} name
     * @property {FoodCategory[]} foodcategory
     *
     * @typedef {Object} FoodCategory
     * @property {string} names
     * @property {string[]} dishes
     */

    const menu = await getMenuDay(restaurant_id, date);
    if (!menu || !Array.isArray(menu.meal)) return null;

    const wanted = meal_name.trim().toLowerCase();
    const found = menu.meal.filter(m => m.name.trim().toLowerCase() === wanted);
    if (!found) return null;

    menu.meal = found;

    return menu;
}

/**
 * Formate un menu pour Discord à partir de l'objet
 *
 * @returns {string} - Menu formaté en string.
 * @param menu
 */
function formatMenu(menu) {
    console.log("row menu: " + JSON.stringify(menu));

    if(!menu || !menu.meal[0].foodcategory) return 'Aucun menu disponible';

    return menu.meal[0].foodcategory
        .map(category => {
            const dishes = category.dishes
                .filter(d => d.trim() !== '')
                .join('\n');
            return `**${category.name}**\n${dishes}`;
        })
        .join('\n\n');
}

module.exports = { getMenu, formatMenu };