import cron from "node-cron";

/** @type {Config} */
import {config} from "../../utils/config_loader";
import {addSubscription, getSubscriptionsForHour, removeSubscription} from "../../db/subscriptions";
import {getMenu} from "./menuService";
import {getRestaurant} from "./restaurantService";
import {renderMenu} from "../message/menuMessage";

/**
 * Follow a restaurant's menu
 * @param guildId
 * @param channelId
 * @param rSourceId
 * @param cron
 * @param role
 * @returns {PrismaPromise<import('@prisma/client').Subscription>}
 */
async function follow(guildId, channelId, rSourceId, cron, role) {
    return await addSubscription(guildId, channelId, rSourceId, cron, role);
}

/**
 * Unfollow a restaurant's menu
 * @param guildId
 * @param channelId
 * @param rSourceId
 * @returns {PrismaPromise<{ count: number }>} Nombre de subscriptions supprimées
 */
async function unfollow(guildId, channelId, rSourceId) {
    return await removeSubscription(guildId, channelId, rSourceId);
}

/**
 * Start the cron job to send menus according to subscriptions
 * @param client
 * @returns {Promise<void>}
 */
async function start(client) {
    const pattern = config.data.cron_subscription
    cron.schedule(pattern, () => {
        const hour = new Date().getHours();

        getSubscriptionsForHour(hour).then(async subscriptions => {
            for (const sub of subscriptions) {
                const menu = await getMenu(sub.restaurantId, 'midi'); //TODO
                const restaurant = await getRestaurant(sub.restaurantId)

                const render = await renderMenu(restaurant, menu);

                const channel = await client.channels.fetch(sub.channelId);
                if (channel && channel.isTextBased()) {
                    await channel.send({ content: render });
                }
            }
        }).catch(console.error);
    });
}

