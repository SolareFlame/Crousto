import {fetchMenu} from "../../integrations/menus.js";
import {getTodayDate} from "../../utils/date_loader.js";
import {findMenuByrId, findMenuById, setMenu} from "../../db/menu.js";
import {getRestaurantById} from "./restaurantService.js";

/**
 * Retourne le menu d'un restaurant pour une date ISO (YYYY-MM-DD).
 *
 * @param {string|number} rId
 * @param date
 * @returns {Promise<Menu|null>}
 */
export async function getAPIMenuByDate(rId, date = getTodayDate()){
    if (!date) throw new Error('date format ISO requis (YYYY-MM-DD)');

    const rSourceId = (await getRestaurantById(rId)).sourceId;

    const rows = await fetchMenu(rSourceId);
    const found = rows.find(r => r.date === date);

    return found || null;
}

/**
 * Retourne les menus d'un restaurant
 *
 * @param {string|number} rId
 * @param _logs
 * @returns {Promise<Menu|null>}
 */
export async function getAPIMenus(rId, _logs = false) {
    const rSourceId = (await getRestaurantById(rId)).sourceId;

    const found = await fetchMenu(rSourceId, _logs);
    return found || null;
}

/**
 * Retourne le menu avec le contenu du repas directement spécifié dans "menu.meal".
 *
 * @param rId
 * @param {string} meal_name
 * @param date
 * @returns {Promise<Meal|null>}
 */
export async function getMenu(rId, meal_name = 'midi', date = getTodayDate()) {
    let menu = await findMenuByrId(rId, meal_name, date);

    // INSERT DB
    if(menu === null) {
        const menu_row = await getAPIMenuByDate(rId, date);

        try {
            if(menu_row) await setMenu(rId, menu_row);
        } catch (error) {
            console.error('Error saving menu to DB:', error);
        }

        menu = await findMenuByrId(rId, meal_name, date);
    }

    if(!menu) return null;
    return menu;
}

export async function getMenuById(mId) {
    return await findMenuById(mId);
}

/**
 * Formate un menu depuis la DB (include: meals.categories.dishes).
 * @param {MenuDB|null} menu - Objet Menu Prisma.
    * @param {string} meal_name - Nom du repas (optionnel).
 * @returns {string}
 */
export function formatMenu(menu, meal_name = 'midi') {
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

