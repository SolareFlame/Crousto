const { fetchMenu } = require('../../integrations/menus');
const { getTodayDate } = require('../../utils/date_loader');
const {findMenuByDate, setMenu} = require("../../db/menu");

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
    let menu = await findMenuByDate(restaurant_id, meal_name, date);

    // INSERT DB
    if(menu === null) {
        const menu_row = await getMenuDay(restaurant_id, date);

        try {
            if(menu_row) await setMenu(restaurant_id, menu_row);
        } catch (error) {
            console.error('Error saving menu to DB:', error);
        }

        menu = await findMenuByDate(restaurant_id, meal_name, date);
    }

    if(!menu) return null;
    return menu;
}

/**
 * Formate un menu depuis la DB (include: meals.categories.dishes).
 * @param {MenuDB|null} menu - Objet Menu Prisma.
    * @param {string} meal_name - Nom du repas (optionnel).
 * @returns {string}
 */
function formatMenu(menu, meal_name = 'midi') {
    if(!menu) {
        return 'Aucun menu disponible';
    }

    const meal =
        (meal_name
            ? menu.meals.find(m => (m?.name || '').toLowerCase() === String(meal_name).toLowerCase())
            : null) || menu.meals[0];

    if (!meal || !Array.isArray(meal.categories) || meal.categories.length === 0) {
        return 'Aucun menu disponible';
    }

    const blocks = meal.categories.map(cat => {
        const title = (cat?.label ?? 'Sans intitulé').trim() || 'Sans intitulé';
        const lines = (cat?.dishes ?? [])
            .map(d => (d?.label ?? '').trim())
            .filter(Boolean);

        const body = lines.length ? lines.join('\n') : '—';
        return `**${title}**\n${body}`;
    });

    return blocks.length ? blocks.join('\n\n') : 'Aucun menu disponible';
}

module.exports = { getMenu, formatMenu };