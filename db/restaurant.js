const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const {config} = require("../utils/config_loader");
const {extractAddress, extractPhone} = require("../utils/data_extractor");

/**
 * @typedef {Object} PlanningDB
 * @property {string} id
 * @property {string} restaurantId
 * @property {number} weekday
 * @property {boolean} isOpen
 * @property {string|null} [label]
 */

/**
 * @typedef {Object} RestaurantDB
 * @property {string} id
 * @property {number} sourceId
 * @property {string} title
 * @property {string|null} [zone]
 * @property {number|null} [latitude]
 * @property {number|null} [longitude]
 * @property {string|null} [thumbnailUrl]
 * @property {string|null} [shortDesc]
 * @property {string|null} [contactHtml]
 * @property {string|null} [infosHtml]
 * @property {any} [json]
 * @property {string} jsonHash
 * @property {Date} createdAt
 * @property {Date} updatedAt
 *
 * @property {PlanningDB[]} [plannings]
 */


/**
 * Retourne tous les restaurants avec leurs plannings.
 * @returns {Promise<RestaurantDB[]>}
 */
async function findAllRestaurants() {
    console.log('DB called: ', 'findAllRestaurants');

    return prisma.restaurant.findMany({
        include: {
            plannings: { orderBy: { weekday: 'asc' } },
        },
        orderBy: { title: 'asc' },
    });
}

/**
 * Trouve un restaurant par son ID avec ses plannings.
 * @param rSourceId
 * @returns {Promise<RestaurantDB>}
 */
async function findRestaurantById(rSourceId) {
    console.log('DB called: ', 'findRestaurantById');

    const ttl = Number(config.db_cache.restaurant_validity_time);
    const threshold = new Date(Date.now() - ttl * 1000);

    return prisma.restaurant.findUnique({
        where: { sourceId: parseInt(rSourceId), updatedAt: { gte: threshold } },
        include: {
            plannings: { orderBy: { weekday: 'asc' } },
        },
    });
}


/**
 * Crée ou met à jour un restaurant et ses plannings.
 * @param {object} item - objet restaurant de l'API (voir exemple dans ton message)
 */
async function setRestaurant(item) {
    console.log('DB called: ', 'setRestaurant');
    const sourceId = Number(item.id);
    const title = item.title ?? '';
    const zone = item.zone ?? null;
    const latitude = item.latitude ?? null;
    const longitude =  item.longitude ?? null;
    const thumbnailUrl = item.thumbnailUrl ?? null;
    const shortDesc = item.shortDesc ?? null;

    const contactHtml = item.contact ?? null;
    const infosHtml = item.infos ?? null;

    const json = JSON.stringify(item);
    const jsonHash = crypto.createHash('md5').update(json).digest('hex');

    const opening = item.opening || {};

    const planningsCreate = Object.entries(opening)
        .map(([day, content]) => ({
            weekday: parseInt(day, 10), // 1..7
            isOpen: content?.isOpen ?? false,
            label: content?.label ?? null,
        }))
        .filter(day => Number.isInteger(day.weekday) && day.weekday >= 1 && day.weekday <= 7);

    const existing = await prisma.restaurant.findFirst({
        where: { sourceId },
        select: { id: true },
    });

    if (!existing) {
        return prisma.restaurant.create({
            data: {
                sourceId,
                title,
                zone,
                latitude,
                longitude,
                thumbnailUrl,
                shortDesc,
                contactHtml,
                infosHtml,
                json,
                jsonHash,
                plannings: planningsCreate.length
                    ? { create: planningsCreate.map(p => ({ ...p })) }
                    : undefined,
            },
            include: { plannings: true },
        });
    }

    return prisma.restaurant.update({
        where: { id: existing.id },
        data: {
            title,
            zone,
            latitude,
            longitude,
            thumbnailUrl,
            shortDesc,
            contactHtml,
            infosHtml,
            json,
            jsonHash,
            plannings: {
                deleteMany: {},
                create: planningsCreate.map(p => ({ ...p })),
            },
        },
        include: { plannings: true },
    });
}

module.exports = { findAllRestaurants, findRestaurantById, setRestaurant };