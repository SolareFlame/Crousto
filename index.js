const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { config } = require('dotenv');
const path = require('path');
const { readdirSync } = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const {updateRestaurants} = require("./services/data/restaurantService");
const { loadFile } = require('./utils/md_loader');

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.commands = new Collection();
client.buttons  = new Collection();
client.selects  = new Collection();
client.modals   = new Collection();

client.once('clientReady', async () => {
    const banner = loadFile('banner');
    if (banner) console.log(banner);

    try {
        await client.application.fetch();
        const application_id = client.application.id;

        await loadEvents();
        await loadCommands(application_id);

        await updateRestaurants();
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

        const event = require(path.join(events_path, file));

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    console.log('Starting: All events loaded.');
}

async function loadCommands(app_id) {
    const commands_path = path.join(__dirname, 'commands');
    const commands_files = readdirSync(commands_path).filter(file => file.endsWith('.js'));

    const commands_json = [];

    for (const file of commands_files) {
        console.log(`- Starting: Loading command file "${file}".`);

        const command = require(path.join(commands_path, file));
        client.commands.set(command.data.name, command);

        commands_json.push(command.data.toJSON());
    }


    await rest.put(
        Routes.applicationGuildCommands(app_id, process.env.DEV_GUILD_ID),
        { body: commands_json }
    );

    console.log('Starting: All commands loaded.');
}