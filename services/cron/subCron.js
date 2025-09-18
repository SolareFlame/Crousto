import {config} from "../../utils/config_loader.js";
import cron from "node-cron";
import {getSubscriptionsForHour} from "../../db/subscriptions.js";
import {getMenu} from "../data/menuService.js";
import {getRestaurant} from "../data/restaurantService.js";
import {renderMenu} from "../message/menuMessage.js";

export const SubscriptionScheduler = {
    task: null,

    /**
     * Démarre le cron d’envoi des menus selon les subscriptions.
     * @param {import('discord.js').Client} client
     * @returns {import('node-cron').ScheduledTask} la tâche cron (avec .stop() / .start())
     */
    start(client) {
        if (this.task) {
            console.warn("Sub: Cron déjà démarrée.");
            return this.task;
        }

        const pattern = config.data.cron_subscription;

        this.task = cron.schedule(
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
                            let render = await renderMenu(restaurant, menu);
                            render.content = sub.roleId ? `<@&${sub.roleId}>` : undefined;

                            const channel = await client.channels.fetch(sub.channelId).catch(() => null);

                            if (channel && typeof channel.isTextBased === "function" && channel.isTextBased()) {
                                await channel.send(render);

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
            {timezone: "Europe/Paris"}
        );

        console.log(`Sub: Tâche démarrée avec pattern="${pattern}" (Europe/Paris).`);
        return this.task;
    },

    stop() {
        if (this.task) {
            this.task.stop();
            console.log("Sub: Tâche stoppée.");
            this.task = null;
        }
    }
};
