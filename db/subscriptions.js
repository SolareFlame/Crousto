import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Add a new subscription
 * @param guildId
 * @param channelId
 * @param restaurantId
 * @param cron
 * @param roleId
 * @returns {Promise<import('@prisma/client').Subscription>}
 */
export async function addSubscription(guildId, channelId, restaurantId, cron, roleId) {
    return prisma.subscription.create({
        data: {
            guildId,
            channelId,
            restaurantId,
            cron,
            roleId
        }
    });
}

/**
 * Remove a subscription
 * @param guildId
 * @param channelId
 * @param restaurantId
 * @returns {Promise<{ count: number }>} Nombre de subscriptions supprimées
 */
export async function removeSubscription(guildId, channelId, restaurantId) {
    return prisma.subscription.deleteMany({
        where: {
            guildId,
            channelId,
            restaurantId
        }
    });
}

/**
 * Get all subscriptions for a guild
 * @param guildId
 * @returns {Promise<import('@prisma/client').Subscription[]>} Tableau des subscriptions
 */
export async function getSubscriptionsByGuildId(guildId) {
    return prisma.subscription.findMany({
        where: {
            guildId
        }
    });
}

/**
 * Get all subscriptions for an hour
 * @param hour
 * @returns {Promise<import('@prisma/client').Subscription[]>} Tableau des subscriptions
 */
export async function getSubscriptionsForHour(hour) {
    return prisma.subscription.findMany({
        where: {
            cron: String(hour),
            active: true
        }
    });
}