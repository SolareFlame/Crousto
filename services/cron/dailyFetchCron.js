import { config } from "../../utils/config_loader.js";
import cron from "node-cron";
import { getAllRestaurants } from "../data/restaurantService.js";
import { getAPIMenus } from "../data/menuService.js";
import { setMenu } from "../../db/menu.js";
import cliProgress from "cli-progress";

export const DailyFetchScheduler = {
    task: null,

    /**
     * Démarre le cron de récupération des menus via l’API.
     * @returns {import('node-cron').ScheduledTask} la tâche cron (avec .stop() / .start())
     */
    start() {
        if (this.task) {
            console.warn("DF: Cron déjà démarrée.");
            return this.task;
        }

        const pattern = config.data.cron_daily_fetch;

        this.task = cron.schedule(
            pattern,
            async () => {
                try {
                    const restaurants = await getAllRestaurants();
                    console.log("DF:", restaurants.length, "restaurants.");

                    const bar = new cliProgress.SingleBar({
                        format: 'DF [{bar}] {percentage}% | {value}/{total} rest. | Restorant: {r}'
                    }, cliProgress.Presets.shades_classic);

                    bar.start(restaurants.length, 0, { r: "init" });

                    for (const r of restaurants) {
                        const menus = await getAPIMenus(r.id);
                        if (menus) {
                            for (const m of menus) {
                                try {
                                    await setMenu(r.id, m);
                                } catch (err) {
                                    console.error(`DF: Erreur sauvegarde menu pour restaurant=${r.id} date=${m.date}:`, err);
                                }
                            }
                        }
                        bar.increment(1, {r: r.title });
                    }

                    bar.stop();
                    console.log("DF: Tick terminé.");

                } catch (err) {
                    console.error("DF: Erreur globale du tick:", err);
                }
            },
            { timezone: "Europe/Paris" }
        );

        console.log(`DF: Tâche démarrée avec pattern="${pattern}" (Europe/Paris).`);
        return this.task;
    },

    stop() {
        if (this.task) {
            this.task.stop();
            console.log("DF: Tâche stoppée.");
            this.task = null;
        }
    }
};
