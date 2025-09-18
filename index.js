import {fileURLToPath, pathToFileURL} from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {Client, GatewayIntentBits, Collection} from "discord.js";
import {config} from "dotenv";

import {readdirSync} from "fs";

import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v10";

import {updateRestaurants} from "./services/data/restaurantService.js";
import {loadFile} from "./utils/md_loader.js";
import {start} from "./services/cron/subCron.js";
import {addGuild} from "./services/data/guildService.js";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

client.commands = new Collection();
client.buttons = new Collection();
client.selects = new Collection();
client.modals = new Collection();

client.once('clientReady', async () => {
    const banner = loadFile('banner');
    if (banner) console.log(banner);

    try {
        await client.application.fetch();
        const application_id = client.application.id;

        await loadEvents();
        await loadCommands(application_id);
        await loadInteraction(client, 'buttons');
        await loadInteraction(client, 'selects');

        await updateGuilds(client);
        await updateRestaurants();

        start(client);
    } catch (error) {
        console.error('Stating: ERROR=', error);
    }
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);


async function loadEvents() {
    const events_path = path.join(__dirname, 'events');
    const events_files = readdirSync(events_path).filter(file => file.endsWith('.js'));

    for (const file of events_files) {
        console.log(`- Starting: Loading event file "${file}".`);

        const abs_path = path.join(events_path, file);
        const file_url = pathToFileURL(abs_path).href;
        const mod = await import(file_url);
        const event = mod.default ?? mod;

        if (!event?.name || typeof event.execute !== "function") {
            console.warn(`Skip "${file}" (export invalide)`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    console.log('Starting: All events loaded.');
}

async function loadCommands(app_id) {
    const commands_path = path.join(__dirname, "commands");
    const commands_files = readdirSync(commands_path).filter(f => f.endsWith(".js"));

    const commands_json = [];

    for (const file of commands_files) {
        console.log(`- Starting: Loading command file "${file}".`);

        const abs_path = path.join(commands_path, file);
        const file_url = pathToFileURL(abs_path).href;
        const mod = await import(file_url);
        const command = mod.default ?? mod;

        client.commands.set(command.data.name, command);
        commands_json.push(command.data.toJSON());
    }

    await rest.put(
        Routes.applicationGuildCommands(app_id, process.env.DEV_GUILD_ID),
        {body: commands_json}
    );

    console.log("Starting: All commands loaded.");
}


/**
 * Loader générique pour buttons, selects, modals
 * @param {Client} client
 * @param {string} folder nom du dossier à charger (, 'buttons', 'selects', 'modals')
 */
async function loadInteraction(client, folder) {
    const folder_path = path.join(__dirname, "events", folder);
    const files = readdirSync(folder_path).filter(f => f.endsWith(".js"));

    for (const file of files) {
        console.log(`- Starting: Loading ${folder}, file "${file}".`);

        const abs_path = path.join(folder_path, file);
        const file_url = pathToFileURL(abs_path).href;
        const mod = await import(file_url);
        const item = mod.default ?? mod;

        const items = Array.isArray(item) ? item : [item];

        for (const it of items) {
            if (!it?.customId || typeof it.execute !== "function") {
                console.warn(`Skip "${file}" (${folder} invalide: il faut .customId et .execute)`);
                continue;
            }

            switch (folder) {
                case "buttons":
                    client.buttons.set(it.customId, it);
                    break;
                case "selects":
                    client.selects.set(it.customId, it);
                    break;
                case "modals":
                    client.modals.set(it.customId, it);
                    break;
                default:
                    console.warn(`Unknown folder type: ${folder}`);
            }
        }
    }

    console.log(`Starting: All ${folder} loaded.`);
}

async function updateGuilds(client) {
    await client.guilds.fetch();

    const tasks = client.guilds.cache.map(async (g) => {
        try {
            await addGuild(g.id, client);
            console.log('Guild loaded:', g.name);
        } catch (e) {
            console.error('Guild load error:', g.id, e?.message || e);
        }
    });

    await Promise.allSettled(tasks);
}