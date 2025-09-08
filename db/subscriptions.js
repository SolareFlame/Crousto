const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Add a new subscription
 * @param guildId
 * @param channelId
 * @param restaurantId
 * @param cron
 * @param role
 * @returns {Promise<import('@prisma/client').Subscription>}
 */
function addSubscription(guildId, channelId, restaurantId, cron, role) {
    return prisma.subscription.create({
        data: {
            guildId,
            channelId,
            restaurantId,
            cron,
            role
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
function removeSubscription(guildId, channelId, restaurantId) {
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
function getSubscriptionsByGuild(guildId) {
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
function getSubscriptionsForHour(hour) {
    const pattern = `0 ${hour} * * *`;
    return prisma.subscription.findMany({
        where: {
            cron: pattern,
            active: true
        }
    });
}

module.exports = {
    addSubscription,
    removeSubscription,
    getSubscriptionsByGuild,
    getSubscriptionsForHour
}