import cron from "node-cron";

/** @type {Config} */
import { config } from "../../utils/config_loader.js";
import {addSubscription, getSubscriptionsForHour, removeSubscription} from "../../db/subscriptions.js";
import { getMenu } from "./menuService.js";
import { getRestaurant } from "./restaurantService.js";
import { renderMenu } from "../message/menuMessage.js";

/**
 * Follow a restaurant's menu
 * @param guildId
 * @param channelId
 * @param rSourceId
 * @param cron
 * @param role
 * @returns {PrismaPromise<import('@prisma/client').Subscription>}
 */
export async function follow(guildId, channelId, rSourceId, cron, role) {
    return await addSubscription(guildId, channelId, rSourceId, cron, role);
}

/**
 * Unfollow a restaurant's menu
 * @param guildId
 * @param channelId
 * @param rSourceId
 * @returns {PrismaPromise<{ count: number }>} Nombre de subscriptions supprimées
 */
export async function unfollow(guildId, channelId, rSourceId) {
    return await removeSubscription(guildId, channelId, rSourceId);
}

/**
 * Start the cron job to send menus according to subscriptions
 * @param client
 * @returns {Promise<void>}
 */
export function start(client) {
    const pattern = config.data.cron_subscription

    cron.schedule(pattern, async () => {
        const hour = new Date().getHours();

        try {
            const subscriptions = await getSubscriptionsForHour(hour);

            for (const sub of subscriptions) {
                const menu = await getMenu(sub.restaurantId, sub.mealName);
                const restaurant = await getRestaurant(sub.restaurantId);
                const render = await renderMenu(restaurant, menu);

                const channel = await client.channels.fetch(sub.channelId);
                if (channel && channel.isTextBased()) {
                    await channel.send({ content: render });
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
}

