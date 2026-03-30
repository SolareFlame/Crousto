import prisma from "./client.js";

import crypto from "crypto";
import {config} from "../utils/config_loader.js";

/**
 * @typedef {Object} DishDB
 * @property {string} id
 * @property {string} categoryId
 * @property {string} label
 * @property {number} position
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} CategoryDB
 * @property {string} id
 * @property {string} mealId
 * @property {string} label
 * @property {number} position
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {DishDB[]} dishes
 */

/**
 * @typedef {Object} MealDB
 * @property {string} id
 * @property {string} menuId
 * @property {string} name
 * @property {number} position
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {CategoryDB[]} categories
 */

/**
 * @typedef {Object} MenuDB
 * @property {string} id
 * @property {number} sourceId
 * @property {string} restaurantId
 * @property {number} restaurantSourceId
 * @property {Date} date
 * @property {Date} fetchedAt
 * @property {any} [json]
 * @property {string} jsonHash
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {MealDB[]} meals
 */


/**
 * Trouve le menu d'un restaurant en utilisant un Id de restaurant, un nom de repas (optionnel) et une date.
 *
 * @param rId
 * @param mealName
 * @param isoDate
 * @returns {Promise<MenuDB|null>}
 */

export async function findMenuByrId(rId, mealName, isoDate) {
    if (!isoDate) throw new Error('isoDate requis (YYYY-MM-DD)');

    const ttl = Number(config.db_cache.menu_validity_time);
    const threshold = new Date(Date.now() - ttl * 1000);

    const start = new Date(`${isoDate}T00:00:00.000Z`);
    const end   = new Date(`${isoDate}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    return prisma.menu.findFirst({
        where: {
            restaurantId: rId,
            date: { gte: start, lt: end },
            ...(mealName ? { meals: { some: { name: String(mealName) } } } : {}),
            updatedAt: { gte: threshold }
        },
        include: {
            meals: {
                orderBy: { position: 'asc' },
                include: {
                    categories: {
                        orderBy: { position: 'asc' },
                        include: { dishes: { orderBy: { position: 'asc' } } },
                    },
                },
            },
        },
        orderBy: [{ fetchedAt: 'desc' }, { createdAt: 'desc' }],
    });
}

export async function findMenuById(mId) {
    return prisma.menu.findUnique({
        where: { id: mId },
        include: {
            meals: {
                orderBy: { position: 'asc' },
                include: {
                    categories: {
                        orderBy: { position: 'asc' },
                        include: { dishes: { orderBy: { position: 'asc' } } },
                    },
                },
            },
        },
    });
}


/**
 * Crée ou met à jour un restaurant et ses plannings.
 * @param {number|string} rId  ID du restaurant (Restaurant.id)
 * @param {object} item              Menu API: { id, date, meal: [...] }
 */
export async function setMenu(rId, item) {

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: rId },
        select: { id: true, sourceId: true },
    });
    if (!restaurant) {
        throw new Error(`Restaurant introuvable pour sourceId=${rId}`);
    }

    const mSourceId = Number(item.id);
    if (!Number.isFinite(mSourceId)) throw new Error(`item.id invalide: ${item.id}`);

    const date = new Date(item.date);

    const jsonObj = item;
    const jsonHash = crypto.createHash('md5').update(JSON.stringify(item)).digest('hex');

    const mealsCreate = (item.meal || []).map((m, i) => ({
        name: m?.name || 'midi',
        position: i,
        categories: {
            create: (m?.foodcategory || []).map((c, j) => ({
                label: c?.name || 'Sans intitulé',
                position: j,
                dishes: {
                    create: (c?.dishes || [])
                        .map((d, k) => ({
                            label: String(d ?? '').trim(),
                            position: k,
                        }))
                        .filter((d) => d.label.length > 0),
                },
            })),
        },
    }));

    return prisma.menu.upsert({
        where: { sourceId: mSourceId },
        create: {
            sourceId: mSourceId,
            restaurantId: restaurant.id,
            restaurantSourceId: restaurant.sourceId,
            date,
            json: jsonObj,
            jsonHash,
            meals: mealsCreate.length ? { create: mealsCreate } : undefined,
        },
        update: {
            restaurantId: restaurant.id,
            restaurantSourceId: restaurant.sourceId,
            date,
            json: jsonObj,
            jsonHash,
            meals: {
                deleteMany: {},
                create: mealsCreate,
            },
        },
        include: {
            meals: {
                orderBy: { position: 'asc' },
                include: {
                    categories: {
                        orderBy: { position: 'asc' },
                        include: { dishes: { orderBy: { position: 'asc' } } },
                    },
                },
            },
        },
    });
}

export async function countMenus() {
    return prisma.menu.count();
}