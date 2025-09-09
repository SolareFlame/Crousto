import cron from "node-cron";
import { config } from "../../utils/config_loader.js";
import { addSubscription, getSubscriptionsForHour, removeSubscription } from "../../db/subscriptions.js";
import { getMenu } from "./menuService.js";
import { getRestaurant } from "./restaurantService.js";
import { renderMenu } from "../message/menuMessage.js";


let subscription_task = null;

/**
 * Démarre le cron d’envoi des menus selon les subscriptions.
 * @param {import('discord.js').Client} client
 * @returns {import('node-cron').ScheduledTask} la tâche cron (avec .stop() / .start())
 */
export function start(client) {
    if (subscription_task) {
        console.warn("Sub: Cron déjà démarrée.");
        return subscription_task;
    }

    const pattern = config.data.cron_subscription;

    subscription_task = cron.schedule(
        pattern,
        async () => {
            const hour = new Date().getHours();

            try {
                const subscriptions = await getSubscriptionsForHour(hour);
                if (!subscriptions?.length) {
                    console.log("Sub: Aucune subscription pour cette heure.");
                    return;
                }

                for (const sub of subscriptions) {
                    try {
                        const menu = await getMenu(sub.restaurantId, sub.mealName);
                        if (!menu) {
                            console.log(`Sub: Pas de menu pour restaurant=${sub.restaurantId} meal=${sub.mealName}`);
                            continue;
                        }

                        const restaurant = await getRestaurant(sub.restaurantId);
                        const render = await renderMenu(restaurant, menu);

                        const channel = await client.channels.fetch(sub.channelId).catch(() => null);

                        if (channel && typeof channel.isTextBased === "function" && channel.isTextBased()) {
                            await channel.send({ content: render });
                            console.log(`Sub: Sent to channel=${sub.channelId} restaurant=${sub.restaurantId}`);
                        } else {
                            console.warn(`Sub: Channel non textuel ou introuvable: ${sub.channelId}`);
                        }

                    } catch (err) {
                        console.error(`Sub: Erreur sur sub ${JSON.stringify(sub)}`, err);
                    }
                }
            } catch (err) {
                console.error("Sub: Erreur globale du tick:", err);
            }
        },
        { timezone: "Europe/Paris" }
    );

    console.log(`Sub: Tâche démarrée avec pattern="${pattern}" (Europe/Paris).`);
    return subscription_task;
}

export function stop() {
    if (subscription_task) {
        subscription_task.stop();
        console.log("Sub: Tâche stoppée.");
        subscription_task = null;
    }
}

export async function follow(guildId, channelId, rSourceId, cronExpr, role) {
    return addSubscription(guildId, channelId, rSourceId, cronExpr, role);
}
export async function unfollow(guildId, channelId, rSourceId) {
    return removeSubscription(guildId, channelId, rSourceId);
}
